# Contact mailer

Small Node service behind `POST /api/contact`. It handles every website form,
selected by the `form` field: `contact` (default), `hrms` (walkthrough request),
`dms` (DMS enquiry) and `subscribe` (monthly brief). Each submission is validated,
appended to `data/submissions.jsonl` (subscriptions also to `data/subscribers.jsonl`),
answered immediately, and then emailed through Gmail SMTP to `CONTACT_TO`
(CC `CONTACT_CC`; subscriptions to `BRIEF_TO`) with an acknowledgement to the visitor.

Deployed on the VPS at `/opt/ppv-contact-mailer`, run by pm2 as
`ppv-contact-mailer`, listening on `127.0.0.1:4130`. nginx proxies
`/api/contact` to it from the platformplayventure.com server block.

```sh
cp .env.example .env && chmod 600 .env   # fill in SMTP_USER / SMTP_PASS
npm install --omit=dev
pm2 start server.js --name ppv-contact-mailer && pm2 save
```
