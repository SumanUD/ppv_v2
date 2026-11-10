// PPV website form mailer.
// Receives every website form at POST /api/contact (proxied by nginx). The
// `form` field picks the form type:
//   contact   - general enquiry (default)
//   hrms      - PPV HRMS walkthrough request
//   dms       - PPV DMS enquiry
//   subscribe - monthly brief subscription
//   automation - business automation / custom software requirement
// Each submission is validated, appended to a JSONL log (DATA_DIR), and then
// emailed to the PPV inbox plus an acknowledgement to the visitor via Gmail
// SMTP. The visitor gets a response as soon as the submission is stored; the
// emails go out in the background. Configuration comes from .env next to this file.
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');

// ---------- config ----------
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const PORT = Number(process.env.PORT || 4130);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const CONTACT_TO = process.env.CONTACT_TO || 'contact@platformplayventure.com';
// Comma-separated addresses copied on every enquiry (not on the visitor's confirmation).
const CONTACT_CC = (process.env.CONTACT_CC || '').split(',').map((s) => s.trim()).filter(Boolean);
// Where brief subscription requests go (defaults to CONTACT_TO).
const BRIEF_TO = process.env.BRIEF_TO || CONTACT_TO;
const FROM_NAME = process.env.FROM_NAME || 'Platform Play Venture';
const SITE_URL = process.env.SITE_URL || 'https://platformplayventure.com';
const PHONE = process.env.CONTACT_PHONE || '+91 79808 26489';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const THANK_YOU_PATH = '/thank-you/';

if (!SMTP_USER || !SMTP_PASS) {
  console.error('SMTP_USER and SMTP_PASS must be set in .env');
  process.exit(1);
}

fs.mkdirSync(DATA_DIR, { recursive: true });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true, // reuse the SMTP connection between messages
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// ---------- validation ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{10}$/;

const str = (v, max = 200) => String(v == null ? '' : v).trim().slice(0, max);
const oneOf = (v, list) => (list.includes(v) ? v : '');

const HRMS_EMPLOYEES = ['1-50', '51-200', '201-500', '501-1,000', '1,000+'];
const DMS_ROLES = ['Supplier / Manufacturer', 'Distributor', 'Dealer', 'Direct Dealer', 'Other'];
const DMS_NETWORK = ['1-10', '11-50', '51-200', '201-500', '500+'];
const CONTACT_NEEDS = ['Strategy & brand', 'Fractional CMO', 'Digital transformation', 'Business software, DMS or HRMS', 'Training', 'Not sure yet'];
const AUTOMATION_NEEDS = ['HRMS', 'Dealer management', 'E-commerce', 'WhatsApp automation', 'Custom software', 'Integration', 'Not sure'];
const DMS_INTERESTS = [
  'Inventory & stock visibility',
  'Order & purchase workflows',
  'Sales, CRM & POS',
  'Finance & accounting',
  'Service & warranty',
  'Reporting & analytics',
  'A complete distribution system',
];

function common(input, errors) {
  const d = { name: str(input.name, 100), email: str(input.email, 254), landing: str(input.landing, 300), utm: str(input.utm, 300) };
  if (d.name.length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(d.email)) errors.email = 'Please enter a valid email address.';
  return d;
}

function phoneOf(input, errors) {
  const phone = str(input.phone, 20);
  if (!PHONE_RE.test(phone)) errors.phone = 'Please enter a valid 10-digit phone number.';
  return phone;
}

const FORMS = {
  contact(input, errors) {
    const d = common(input, errors);
    d.phone = phoneOf(input, errors);
    d.message = str(input.message, 5000);
    d.engagement = str(input.engagement, 80) || 'Strategic';
    d.company = str(input.company, 120);
    d.role = str(input.role, 120);
    d.need = oneOf(str(input.need), CONTACT_NEEDS);
    if (!d.need) errors.need = 'Please choose what you need help with.';
    if (d.message.length < 10) errors.message = 'Please tell us a little more (at least 10 characters).';
    return d;
  },
  hrms(input, errors) {
    const d = common(input, errors);
    d.company = str(input.company, 120);
    d.phone = phoneOf(input, errors);
    d.designation = str(input.designation, 120);
    d.employees = oneOf(str(input.employees), HRMS_EMPLOYEES);
    d.explore = str(input.explore, 3000);
    if (d.company.length < 2) errors.company = 'Please enter your company name.';
    if (d.designation.length < 2) errors.designation = 'Please enter your designation.';
    if (!d.employees) errors.employees = 'Please select the number of employees.';
    return d;
  },
  dms(input, errors) {
    const d = common(input, errors);
    d.phone = phoneOf(input, errors);
    d.company = str(input.company, 120);
    d.role = oneOf(str(input.role), DMS_ROLES);
    d.network = oneOf(str(input.network), DMS_NETWORK);
    d.interest = oneOf(str(input.interest), DMS_INTERESTS);
    d.requirements = str(input.requirements, 3000);
    d.consent = input.consent === 'yes' || input.consent === true;
    if (d.company.length < 2) errors.company = 'Please enter your company name.';
    if (!d.role) errors.role = 'Please select your business role.';
    if (!d.network) errors.network = 'Please select your network size.';
    if (!d.interest) errors.interest = 'Please select your primary requirement.';
    if (!d.consent) errors.consent = 'Please agree to be contacted about your enquiry.';
    return d;
  },
  automation(input, errors) {
    const d = common(input, errors);
    d.company = str(input.company, 120);
    d.phone = phoneOf(input, errors);
    d.need = oneOf(str(input.need), AUTOMATION_NEEDS);
    d.message = str(input.message, 3000);
    if (d.company.length < 2) errors.company = 'Please enter your company name.';
    if (!d.need) errors.need = 'Please choose what you want to automate or build.';
    return d;
  },
  subscribe(input, errors) {
    const d = common(input, errors);
    d.company = str(input.company, 120);
    d.consent = input.consent === 'yes' || input.consent === true;
    if (!d.consent) errors.consent = 'Please confirm you would like to receive the brief.';
    return d;
  },
};

// ---------- rate limit: 5 submissions per IP per 10 minutes ----------
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (list.every((t) => now - t >= WINDOW_MS)) hits.delete(ip);
}, WINDOW_MS).unref();

// ---------- storage ----------
function store(type, data, meta) {
  const line = JSON.stringify({ type, at: new Date().toISOString(), ip: meta.ip, ...data }) + '\n';
  fs.appendFileSync(path.join(DATA_DIR, 'submissions.jsonl'), line);
  if (type === 'subscribe') fs.appendFileSync(path.join(DATA_DIR, 'subscribers.jsonl'), line);
}

// ---------- email bodies ----------
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const nl2br = (s) => esc(s).replace(/\r?\n/g, '<br>');
const firstName = (name) => name.split(/\s+/)[0];
const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
const phoneLink = `<a href="${telHref(PHONE)}" style="color:#EE5A18">${esc(PHONE)}</a>`;

function shell(inner) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#F8F6F1;font-family:Inter,Arial,sans-serif;color:#1d1d1f">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;border:1px solid #e8e4da">${inner}
<p style="margin:28px 0 0;font-size:12px;color:#8a8a8a">Platform Play Venture · <a href="${SITE_URL}" style="color:#EE5A18">www.platformplayventure.com</a> · ${phoneLink}</p>
</div></body></html>`;
}

const para = (t) => `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">${t}</p>`;
const signoff = `${para('Regards,<br>Team Platform Play Venture<br><a href="' + SITE_URL + '" style="color:#EE5A18">www.platformplayventure.com</a>')}`;

/** Internal notification: a heading, a table of fields and an optional long-text block. */
function notification({ subject, heading, rows, longLabel, longText, d, meta }) {
  const tr = (k, v) =>
    `<tr><td style="padding:8px 12px 8px 0;color:#6b6b6b;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0">${v}</td></tr>`;
  const all = [
    ['Name', esc(d.name)],
    ['Email', `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`],
    ...(d.phone ? [['Contact number', `<a href="${telHref(d.phone)}">${esc(d.phone)}</a>`]] : []),
    ...rows.map(([k, v]) => [k, esc(v || '—')]),
    ['Submitted', esc(meta.when)],
    ...(d.landing ? [['Landing page', esc(d.landing)]] : []),
    ...(d.utm ? [['Source', esc(d.utm)]] : []),
  ];
  const textRows = all.map(([k, v]) => `${k}: ${String(v).replace(/<[^>]+>/g, '')}`).join('\n');
  return {
    subject,
    text: `${heading}\n\n${textRows}${longLabel ? `\n\n${longLabel}:\n${longText || '—'}` : ''}\n\n--\nIP ${meta.ip}`,
    html: shell(`<h2 style="margin:0 0 16px;font-size:20px">${esc(heading)}</h2>
<table style="border-collapse:collapse;font-size:15px">${all.map(([k, v]) => tr(k, v)).join('')}</table>
${longLabel ? `<h3 style="margin:20px 0 8px;font-size:15px">${esc(longLabel)}</h3><p style="margin:0;font-size:15px;line-height:1.6">${longText ? nl2br(longText) : '—'}</p>` : ''}
<p style="margin:20px 0 0;font-size:12px;color:#8a8a8a">IP ${esc(meta.ip)} · Reply to this email to answer ${esc(d.name)} directly.</p>`),
  };
}

const MAILS = {
  contact: {
    internal: (d, meta) =>
      notification({
        subject: `New website enquiry from ${d.name} – ${d.need || d.engagement}`,
        heading: 'New website enquiry',
        rows: [
          ['Needs help with', d.need],
          ['Engagement', d.engagement],
          ['Company', d.company],
          ['Role', d.role],
        ],
        longLabel: 'Message',
        longText: d.message,
        d,
        meta,
      }),
    visitor: (d) => ({
      subject: 'We have received your message | Platform Play Venture',
      text: `Hi ${firstName(d.name)},\n\nThank you for reaching out to Platform Play Venture. We have received your message and our team will get back to you within one business day.\n\nYour message:\n${d.message}\n\nIf anything is urgent, call us on ${PHONE} or reply to this email.\n\nRegards,\nTeam Platform Play Venture\n${SITE_URL}`,
      html: shell(`<h2 style="margin:0 0 16px;font-size:20px">Thank you, ${esc(firstName(d.name))}.</h2>
${para('We have received your message and our team will get back to you within one business day.')}
<p style="font-size:13px;color:#6b6b6b;margin:20px 0 6px">Your message</p>
<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #EE5A18;background:#faf8f3;font-size:14px;line-height:1.6">${nl2br(d.message)}</blockquote>
${para(`If anything is urgent, call us on ${phoneLink} or simply reply to this email.`)}
${signoff}`),
    }),
  },

  hrms: {
    internal: (d, meta) =>
      notification({
        subject: `New PPV HRMS Walkthrough Request – ${d.company}`,
        heading: 'New PPV HRMS walkthrough request',
        rows: [
          ['Company', d.company],
          ['Designation', d.designation],
          ['Employee count', d.employees],
        ],
        longLabel: 'Specific requirements',
        longText: d.explore,
        d,
        meta,
      }),
    visitor: (d) => {
      const lines = [
        'Thank you for your interest in PPV HRMS!',
        "We've successfully received your request for a platform walkthrough.",
        "We look forward to showing you how PPV HRMS can help streamline your organisation's HR operations, simplify processes and improve workforce management.",
        'Our team will get in touch with you shortly to understand your requirements and coordinate a convenient time for the walkthrough.',
        "In the meantime, if you have any specific questions or areas you'd like us to cover during the demonstration, feel free to reply to this email.",
        'We look forward to connecting with you!',
      ];
      return {
        subject: 'Your PPV HRMS walkthrough request | Platform Play Venture',
        text: `Hi ${firstName(d.name)},\n\n${lines.join('\n\n')}\n\nRegards,\nTeam Platform Play Venture\nwww.platformplayventure.com`,
        html: shell(`${para(`Hi ${esc(firstName(d.name))},`)}${lines.map((l, i) => para(i === 0 ? `<strong>${esc(l)}</strong>` : esc(l))).join('')}${signoff}`),
      };
    },
  },

  dms: {
    internal: (d, meta) =>
      notification({
        subject: `New PPV DMS Enquiry – ${d.company}`,
        heading: 'New PPV DMS enquiry',
        rows: [
          ['Company', d.company],
          ['Business role', d.role],
          ['Distribution network size', d.network],
          ['Area of interest', d.interest],
        ],
        longLabel: 'Requirements',
        longText: d.requirements,
        d,
        meta,
      }),
    visitor: (d) => {
      const lines = [
        'Thank you for your interest in PPV DMS!',
        "We've successfully received your enquiry and appreciate the opportunity to learn more about your business and distribution requirements.",
        'PPV DMS is designed to connect distribution operations through better visibility, streamlined workflows and centralised business intelligence.',
        "Our team will review the information you've shared and contact you shortly to understand your requirements and discuss the next steps.",
        'We look forward to connecting with you.',
      ];
      return {
        subject: 'Your PPV DMS enquiry | Platform Play Venture',
        text: `Hi ${firstName(d.name)},\n\n${lines.join('\n\n')}\n\nRegards,\nTeam Platform Play Venture\nwww.platformplayventure.com`,
        html: shell(`${para(`Hi ${esc(firstName(d.name))},`)}${lines.map((l, i) => para(i === 0 ? `<strong>${esc(l)}</strong>` : esc(l))).join('')}${signoff}`),
      };
    },
  },

  automation: {
    internal: (d, meta) =>
      notification({
        subject: `New business automation enquiry – ${d.company}`,
        heading: 'New business automation / custom software enquiry',
        rows: [
          ['Company', d.company],
          ['Wants to automate or build', d.need],
        ],
        longLabel: 'Message',
        longText: d.message,
        d,
        meta,
      }),
    visitor: (d) => ({
      subject: 'We have received your requirement | Platform Play Venture',
      text: `Hi ${firstName(d.name)},

Thank you for telling us about your requirement (${d.need}). Our technology team will review it and get back to you within one business day.

If anything is urgent, call us on ${PHONE} or reply to this email.

Regards,
Team Platform Play Venture
www.platformplayventure.com`,
      html: shell(`${para(`Hi ${esc(firstName(d.name))},`)}
${para(`<strong>Thank you for telling us about your requirement (${esc(d.need)}).</strong>`)}
${para('Our technology team will review it and get back to you within one business day.')}
${para(`If anything is urgent, call us on ${phoneLink} or simply reply to this email.`)}
${signoff}`),
    }),
  },

  subscribe: {
    to: () => BRIEF_TO,
    internal: (d, meta) => {
      const m = notification({
        subject: 'Subscription Request – PPV Strategic Brief',
        heading: 'Subscription request – PPV Strategic Brief',
        rows: [['Company', d.company], ['Consent', 'Given on the website form']],
        d,
        meta,
      });
      const intro = `Hello Team Platform Play Venture,\n\nI would like to subscribe to the PPV monthly brief and receive strategic insights on business growth, marketing, technology and digital transformation.\n\nThank you.\n${d.name}`;
      m.text = `${intro}\n\n${m.text}`;
      m.html = m.html.replace('<h2', `${para(nl2br(intro))}<hr style="border:0;border-top:1px solid #eee;margin:18px 0"><h2`);
      return m;
    },
    visitor: (d) => ({
      subject: "You're subscribed to the PPV Strategic Brief",
      text: `Hi ${firstName(d.name)},\n\nThank you for subscribing to the PPV monthly brief. Once a month you will receive strategic insights on business growth, marketing, technology and digital transformation.\n\nIf you did not request this, simply reply to this email and we will remove you.\n\nRegards,\nTeam Platform Play Venture\nwww.platformplayventure.com`,
      html: shell(`${para(`Hi ${esc(firstName(d.name))},`)}
${para('<strong>Thank you for subscribing to the PPV monthly brief.</strong>')}
${para('Once a month you will receive strategic insights on business growth, marketing, technology and digital transformation.')}
${para('If you did not request this, simply reply to this email and we will remove you.')}
${signoff}`),
    }),
  },
};

async function sendAll(type, data, meta) {
  const mails = MAILS[type];
  const from = { name: FROM_NAME, address: SMTP_USER };
  const to = mails.to ? mails.to() : CONTACT_TO;
  let delivered = true;
  try {
    await transporter.sendMail({
      from,
      to,
      cc: CONTACT_CC.length ? CONTACT_CC : undefined,
      replyTo: { name: data.name, address: data.email },
      ...mails.internal(data, meta),
    });
  } catch (err) {
    delivered = false;
    console.error(`[${meta.when}] ${type} notification failed:`, err.message);
  }
  try {
    await transporter.sendMail({ from, to: { name: data.name, address: data.email }, replyTo: to, ...mails.visitor(data) });
  } catch (err) {
    console.error(`[${meta.when}] ${type} acknowledgement to ${data.email} failed:`, err.message);
  }
  return delivered;
}

// ---------- http ----------
function readBody(req, limit = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseBody(req, raw) {
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) return JSON.parse(raw || '{}');
  return Object.fromEntries(new URLSearchParams(raw));
}

const server = http.createServer(async (req, res) => {
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const reply = (status, body) => {
    if (wantsJson) {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    } else {
      // Plain HTML form post (no JS): send the visitor to the right page.
      res.writeHead(303, { Location: body.success ? THANK_YOU_PATH : '/contact/?form=error#contact' });
      res.end();
    }
  };

  if (req.url.split('?')[0] !== '/api/contact') return reply(404, { success: false, message: 'Not found' });
  if (req.method !== 'POST') return reply(405, { success: false, message: 'Method not allowed' });

  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
  let input;
  try {
    input = parseBody(req, await readBody(req));
  } catch (err) {
    return reply(err.status || 400, { success: false, message: 'Invalid request.' });
  }

  // Honeypot filled in: a bot. Pretend it worked.
  if (input.botcheck) return reply(200, { success: true, redirect: THANK_YOU_PATH });

  const type = Object.hasOwn(FORMS, input.form) ? input.form : 'contact';
  const errors = {};
  const data = FORMS[type](input, errors);
  if (Object.keys(errors).length) return reply(422, { success: false, message: 'Please check the highlighted fields.', errors });

  if (rateLimited(ip)) return reply(429, { success: false, message: 'Too many submissions. Please try again in a few minutes.' });

  const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
  const meta = { when, ip };

  let stored = true;
  try {
    store(type, data, meta);
  } catch (err) {
    stored = false;
    console.error(`[${when}] could not store ${type} submission:`, err.message);
  }

  console.log(`[${when}] ${type} from ${data.email} (${ip})`);
  if (stored) {
    // Saved to disk, so answer the visitor now and send the emails afterwards.
    reply(200, { success: true, redirect: THANK_YOU_PATH });
    sendAll(type, data, meta);
    return;
  }
  // Not stored: only report success once the emails have gone out.
  if (!(await sendAll(type, data, meta))) {
    return reply(502, { success: false, message: 'Your message could not be sent right now.' });
  }
  return reply(200, { success: true, redirect: THANK_YOU_PATH });
});

server.listen(PORT, '127.0.0.1', () => console.log(`contact-mailer listening on 127.0.0.1:${PORT}`));
