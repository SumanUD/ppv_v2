/**
 * PPV product catalogue — single source of truth.
 *
 * Consumed by:
 *   - src/pages/products.astro        (listing)
 *   - src/pages/product/[slug].astro  (detail, via getStaticPaths)
 *   - src/pages/technology.astro      (live-products band)
 *
 * To add a product, append one object. No new pages required.
 */

export interface DemoAccount {
  role: string;
  emails: string[];
  note?: string;
}

export interface LiveEnvironment {
  label: string;
  url: string;
  blurb: string;
  accounts: DemoAccount[];
}

export interface Product {
  slug: string;
  name: string;
  fullName: string;
  status: 'live' | 'maintenance' | 'coming-soon';
  /** Shown on cards and the detail hero. */
  tagline: string;
  /** One-line positioning statement — the "what it really is". */
  positioning: string;
  /** 2–3 sentences for the listing card and the technology-page band. */
  summary: string;
  /** Headline numbers for the detail hero. */
  metrics: { value: string; label: string }[];
  /** Quick capability chips for the listing card. */
  highlights: string[];
  /**
   * Live demo environments. Empty array => no live panel is rendered and the
   * page falls back to a "request a walkthrough" CTA.
   */
  live: LiveEnvironment[];
  /** Shared demo password, if the environments expose one publicly. */
  demoPassword?: string;
  /** Note rendered above the credentials table. */
  demoNote?: string;
  closing: string;
}

/* ------------------------------------------------------------------ *
 * HRMS
 * ------------------------------------------------------------------ */

export const hrmsChallenges = [
  'Disconnected employee records',
  'Manual attendance tracking',
  'Complex leave approvals',
  'Time-consuming payroll processing',
  'Limited performance visibility',
  'Multiple systems, duplicate data entry',
];

export const hrmsCapabilities = [
  'Employee Management',
  'Recruitment & Hiring',
  'Attendance Tracking',
  'Leave Management',
  'Payroll Processing',
  'Performance Management',
  'Asset Management',
  'Employee Self-Service',
  'Helpdesk & Support',
  'Reporting & Analytics',
];

export const hrmsLifecycle = [
  { n: '01', title: 'Recruitment', text: 'Attract and hire the right talent.' },
  { n: '02', title: 'Onboarding', text: 'Streamline employee joining processes.' },
  { n: '03', title: 'Employee Management', text: 'Centralized employee records.' },
  { n: '04', title: 'Attendance & Leave', text: 'Track availability effortlessly.' },
  { n: '05', title: 'Payroll', text: 'Automate salary and compliance.' },
  { n: '06', title: 'Performance', text: 'Structured reviews and growth.' },
  { n: '07', title: 'Asset Management', text: 'Track and manage company assets.' },
  { n: '08', title: 'Self-Service', text: 'Empower employees directly.' },
];

export const hrmsCategories = [
  {
    n: '01',
    title: 'Workforce Management',
    items: ['Employee Management', 'Organization Structure', 'User Roles & Permissions'],
  },
  {
    n: '02',
    title: 'Workforce Operations',
    items: ['Attendance Management', 'Leave Management', 'Payroll Management'],
  },
  {
    n: '03',
    title: 'Talent Management',
    items: ['Recruitment', 'Onboarding', 'Performance Management'],
  },
  {
    n: '04',
    title: 'Employee Services',
    items: ['Asset Management', 'HR Helpdesk', 'Self-Service Portal'],
  },
  {
    n: '05',
    title: 'Intelligence & Reporting',
    items: ['Reports & Analytics', 'Management Dashboards', 'MIS Reporting'],
  },
];

export const hrmsRoles = [
  { n: '01', title: 'HR Administrators', text: 'Full system control and configuration.' },
  { n: '02', title: 'HR Managers', text: 'Team-wide HR operations.' },
  { n: '03', title: 'Department Heads', text: 'Department-level visibility.' },
  { n: '04', title: 'Reporting Managers', text: 'Direct reports and approvals.' },
  { n: '05', title: 'Recruiters', text: 'Hiring and candidate pipeline.' },
  { n: '06', title: 'Finance & Payroll Teams', text: 'Payroll, compensation, statutory.' },
  { n: '07', title: 'IT Administrators', text: 'Configuration and integrations.' },
  { n: '08', title: 'Employees', text: 'Self-service and personal records.' },
];

export const hrmsIntegrations = [
  {
    kicker: 'Hardware',
    title: 'Devices & Attendance',
    items: ['Biometric attendance devices', 'Payroll banking systems', 'Accounting software'],
  },
  {
    kicker: 'Productivity',
    title: 'Workspace & Comms',
    items: ['Microsoft 365', 'Google Workspace', 'SMTP email services'],
  },
  {
    kicker: 'Enterprise',
    title: 'Identity & ERP',
    items: ['ERP solutions', 'Active Directory', 'LDAP · Single Sign-On (SSO)'],
  },
];

export const hrmsMigration = {
  from: [
    'Spreadsheets · standalone HR tools',
    'Legacy databases · paper records',
    'Point solutions · custom in-house apps',
  ],
  to: [
    'Employee records',
    'Payroll history',
    'Departments',
    'Employee documents',
    'Designations',
    'Asset records',
    'Leave balances',
    'Performance data',
    'Attendance history',
  ],
};

export const hrmsPhases = [
  { n: '01', title: 'Requirement Gathering & Discovery', text: 'Kickoff, scope, stakeholder mapping.' },
  { n: '02', title: 'Data Collection & Validation', text: 'Templates shared, records verified.' },
  { n: '03', title: 'System Configuration', text: 'Policies, workflows and rules applied.' },
  { n: '04', title: 'Employee Data Migration', text: 'Records, history and balances imported.' },
  { n: '05', title: 'Role & Permission Setup', text: 'Access controls and hierarchies.' },
  { n: '06', title: 'User Training & Testing', text: 'Admin and end-user sessions, UAT.' },
  { n: '07', title: 'Go-Live & Support', text: 'Launch, hyper-care and ongoing help.' },
];

export const hrmsWhy = [
  { n: '01', title: 'Operational Efficiency', text: 'Reduce manual HR workload and reclaim hours every week.' },
  { n: '02', title: 'Improved Accuracy', text: 'Eliminate duplicate entries and error-prone workflows.' },
  { n: '03', title: 'Faster Decisions', text: 'Real-time dashboards and reports at your fingertips.' },
  { n: '04', title: 'Better Employee Experience', text: 'Self-service, transparency and instant access.' },
  { n: '05', title: 'Stronger Compliance', text: 'Standardized policies and auditable workflows.' },
  { n: '06', title: 'Greater Visibility', text: 'Complete workforce insight in one place.' },
];

export const hrmsOnboardingInputs = [
  {
    n: '01',
    title: 'Company Information',
    items: ['Organization structure', 'Departments', 'Designations', 'Branch locations'],
  },
  {
    n: '02',
    title: 'Employee Information',
    items: ['Employee master data', 'Reporting structure', 'Employee documents'],
  },
  {
    n: '03',
    title: 'HR Policies',
    items: ['Attendance policy', 'Leave policy', 'Working hours policy', 'Holiday calendar'],
  },
  {
    n: '04',
    title: 'Payroll Information',
    items: ['Salary structure', 'Allowances & deductions', 'Statutory components', 'Bank details'],
  },
  {
    n: '05',
    title: 'IT Infrastructure',
    items: ['Server details', 'Domain information', 'Email configuration', 'SSL certificates'],
  },
];

/* ------------------------------------------------------------------ *
 * DMS
 * ------------------------------------------------------------------ */

export const dmsPillars = [
  { n: '01', text: 'Role-based access, enforced at the API layer' },
  { n: '02', text: 'IMEI-level tracking of every single unit' },
  { n: '03', text: 'One ledger syncing inventory, accounting & CRM' },
  { n: '04', text: 'A phased, actually-affordable AI roadmap' },
];

export const dmsRoles = [
  {
    n: '01',
    title: 'Supplier',
    kicker: 'Admin / OEM',
    text: 'Owns the product catalog, pricing and stock allocation. Full visibility across the entire network.',
    accent: true,
  },
  {
    n: '02',
    title: 'Distributor',
    kicker: 'Territory tier',
    text: 'Buys in bulk from the Supplier, resells to Dealers in an assigned territory. Cannot see other distributors’ data.',
    accent: false,
  },
  {
    n: '03',
    title: 'Dealer',
    kicker: 'Retail outlet',
    text: 'Buys from a Distributor and sells to end customers through a retail outlet. Cannot see other dealers’ data.',
    accent: false,
  },
  {
    n: '04',
    title: 'Direct-Dealer',
    kicker: 'Strategic partner',
    text: 'A large-volume partner buying directly from the Supplier, bypassing the Distributor tier — otherwise operating as a Dealer.',
    accent: false,
  },
];

export const dmsModules = [
  {
    n: '01',
    title: 'Inventory & Stock',
    text: 'IMEI/serial tracking, cascading allocation, low-stock alerts, barcode GRN and transfers.',
    detail: [
      'IMEI/serial-level tracking for every unit — not just quantity counts.',
      'Stock allocation cascade: Supplier → Distributor → Dealer; Direct-Dealer allocated straight from Supplier.',
      'Real-time visibility at every tier, with low-stock auto-alerts and reorder suggestions.',
      'Stock transfer and return workflow between tiers, with a full approval chain.',
      'Barcode / QR scanning for inward (GRN) and outward (sale, transfer) movements.',
    ],
  },
  {
    n: '02',
    title: 'Order & Purchase',
    text: 'Live price lists, MOQ and credit rules, approval thresholds, full status tracking.',
    detail: [
      'Partners place purchase orders against live stock and price lists.',
      'Supplier sets MOQ, credit limits and approval rules per partner — auto-approval below a threshold, manager approval above it.',
      'Bulk order upload (CSV) and reorder-from-history for repeat purchases.',
    ],
  },
  {
    n: '03',
    title: 'Sales & CRM',
    text: 'Multi-channel lead capture, follow-ups, quotations, POS with EMI integration.',
    detail: [
      'Lead capture from walk-ins, calls, WhatsApp and website — auto-assigned to the right Dealer by territory.',
      'Follow-up reminders, quotation generation and conversion tracking per salesperson.',
      'POS/billing at Dealer and Direct-Dealer level, with EMI and finance-partner integration.',
    ],
  },
  {
    n: '04',
    title: 'Finance & Accounting',
    text: 'Tiered ledgers, auto invoicing, scheme engine, accounting-software sync.',
    detail: [
      'Tiered ledgers — the Supplier sees consolidated network P&L; each partner sees only its own.',
      'Automated invoicing, credit-note handling and outstanding / aging reports.',
      'Scheme and discount engine applied automatically at billing, plus accounting-software export.',
    ],
  },
  {
    n: '05',
    title: 'Service & Warranty',
    text: 'IMEI-linked warranty, RMA routing to service points, refurb stock handling.',
    detail: [
      'Warranty registration tied to IMEI at the point of sale.',
      'RMA workflow: fault logged → routed to nearest authorised service point → status tracked back to the customer.',
      'Replacement and refurbishment stock handled as its own inventory sub-type.',
    ],
  },
  {
    n: '06',
    title: 'Reporting & Analytics',
    text: 'Role-scoped dashboards, sell-in vs sell-out, scheduled PDF/Excel exports.',
    detail: [
      'Role-scoped dashboards — every tier sees exactly what it needs, no more and no less.',
      'Sell-in vs sell-out reporting across the network.',
      'Scheduled PDF/Excel exports and management information reporting.',
    ],
  },
];

/** Role-based feature matrix — the core of the RBAC design. */
export const dmsMatrix = {
  roles: ['Supplier', 'Distributor', 'Dealer', 'Direct-Dealer'],
  groups: [
    {
      title: 'Core operations',
      rows: [
        {
          module: 'Inventory / Stock',
          cells: [
            'Full visibility; allocate stock to distributors',
            'View allotted; request replenishment; push to dealers',
            'View allotted; request from distributor; sell',
            'View allotted; request from supplier; sell',
          ],
        },
        {
          module: 'Order & Purchase',
          cells: [
            'Approve / reject bulk orders; set MOQ & credit limits',
            'Place bulk POs; split & forward to dealers',
            'Order to distributor; track order status',
            'Order directly to supplier',
          ],
        },
        {
          module: 'Pricing & Schemes',
          cells: [
            'Define MRP, slab pricing, schemes, discounts',
            'Distributor slab; apply dealer-level schemes',
            'Dealer slab; apply customer offers',
            'Direct slab (distributor-tier pricing)',
          ],
        },
        {
          module: 'Customer Sales / POS',
          cells: [
            'B2B only',
            'B2B only',
            'Full POS / billing to end customer',
            'Full POS / billing to end customer',
          ],
        },
        {
          module: 'CRM & Leads',
          cells: [
            'National sales dashboard; escalation view',
            'Regional leads; dealer performance tracking',
            'Local leads, follow-ups, walk-ins, AI call scoring',
            'Local leads, follow-ups, walk-ins, AI call scoring',
          ],
        },
      ],
    },
    {
      title: 'Control, service & insights',
      rows: [
        {
          module: 'Finance / Ledger',
          cells: [
            'Consolidated P&L across network; credit control',
            'Distributor ledger; dealer credit & outstanding',
            'Dealer ledger; customer invoices; EMI / finance',
            'Own ledger; customer invoices; EMI / finance',
          ],
        },
        {
          module: 'Service / Warranty (RMA)',
          cells: [
            'Warranty policy setup; claim approval',
            'Regional service centre allocation; claim forwarding',
            'Log service / repair tickets; replacement requests',
            'Log service / repair tickets; replacement requests',
          ],
        },
        {
          module: 'Reporting & Analytics',
          cells: [
            'Company-wide KPIs; AI demand forecasting',
            'Region reports; sell-in vs sell-out',
            'Store-level sales & stock reports',
            'Store-level sales & stock reports',
          ],
        },
        {
          module: 'User & Role Management',
          cells: [
            'Create / manage all roles; RBAC policies',
            'Manage own sub-dealers (if permitted)',
            'Manage own staff (salesperson, cashier)',
            'Manage own staff (salesperson, cashier)',
          ],
        },
        {
          module: 'Notifications & Alerts',
          cells: [
            'Broadcast to entire network',
            'Regional broadcast + own alerts',
            'Low-stock, order-status, payment-due alerts',
            'Low-stock, order-status, payment-due alerts',
          ],
        },
      ],
    },
  ],
};

export const dmsOrderStatus = ['Placed', 'Approved', 'Dispatched', 'Delivered', 'Invoiced'];

export const dmsChannels = [
  {
    label: 'Standard channel',
    note: '3-tier supply chain',
    steps: [
      { title: 'Supplier', text: 'Adds models to catalog with pricing tiers; allocates initial stock to Distributors by territory.' },
      { title: 'Distributor', text: 'Places a PO; on approval stock and invoice generate and inventory updates in real time. Allocates to Dealers on credit limits.' },
      { title: 'Dealer', text: 'Receives stock via GRN scan — Inventory, Accounting and CRM update automatically from a single source of truth.' },
      { title: 'End Customer', text: 'POS sale reduces stock, generates the invoice, registers IMEI warranty and closes the CRM lead.' },
    ],
  },
  {
    label: 'Direct-dealer channel',
    note: 'Distributor tier bypassed',
    steps: [
      { title: 'Supplier', text: 'Onboards and approves the partner directly — typically large-volume or strategic partners.' },
      { title: 'Distributor', text: 'Bypassed entirely for this channel.', muted: true },
      { title: 'Direct-Dealer', text: 'Receives distributor-tier pricing. From stock receipt onward the flow mirrors the Dealer path.' },
      { title: 'End Customer', text: 'Identical end-customer experience — but ledger and reporting roll up directly to the Supplier.' },
    ],
  },
];

export const dmsFoundations = [
  {
    n: '01',
    title: 'Event-driven, not batch',
    text: 'Every action — order, transfer, sale, price change — fires an event/webhook so Inventory, Accounting and CRM update instantly.',
  },
  {
    n: '02',
    title: 'RBAC at the data layer',
    text: 'A Dealer’s login can never query another Dealer’s or Distributor’s data — even by direct API call. Not hidden buttons; enforced access.',
  },
  {
    n: '03',
    title: 'Full audit trail',
    text: 'Every create, update and delete on financial or customer data is logged — who, when, and exactly what changed.',
  },
  {
    n: '04',
    title: 'Offline-safe mobile',
    text: 'Field sales and service staff queue actions offline; sync resumes without duplicate records.',
  },
];

export const dmsAiPhases = [
  {
    phase: 'Phase 1',
    weight: 'Easy',
    title: 'Immediate wins',
    accent: true,
    items: [
      { text: 'AI lead summariser & auto-reply drafts', roles: 'Dealer, Direct-Dealer' },
      { text: 'Support chatbot — FAQs, order & warranty status', roles: 'All roles + end customer' },
      { text: 'OCR for ID proof, invoice & trade-in capture', roles: 'Dealer, Direct-Dealer' },
      { text: 'Auto-generated product listing descriptions', roles: 'Distributor, Dealer, Direct-Dealer' },
    ],
  },
  {
    phase: 'Phase 2',
    weight: 'Medium',
    title: 'Operating leverage',
    accent: false,
    items: [
      { text: 'Sales-call recording & scoring, flagging cold/lost leads', roles: 'Dealer, Direct-Dealer, Supplier oversight' },
      { text: 'Demand forecasting & auto replenishment suggestions', roles: 'Supplier, Distributor' },
      { text: 'Pricing suggestions vs competitor & market pricing', roles: 'Distributor, Dealer, Direct-Dealer' },
      { text: 'Accounting anomaly & fraud flag detection', roles: 'Supplier, Distributor' },
    ],
  },
  {
    phase: 'Phase 3',
    weight: 'Long term',
    title: 'Compounding value',
    accent: false,
    items: [
      { text: 'Conversational “ask your DMS” natural-language search', roles: 'All roles' },
      { text: 'AI-assisted deal desking, bundle & upsell suggestions', roles: 'Dealer, Direct-Dealer' },
      { text: 'Predictive service & replacement outreach', roles: 'Dealer, Direct-Dealer' },
    ],
  },
];

export const dmsDifferentiators = [
  {
    kicker: 'Depth where it matters',
    text: 'IMEI-level serial tracking, cascading stock allocation, automated order workflows with approval rules, and a unified ledger syncing instantly across inventory, accounting and CRM.',
  },
  {
    kicker: 'Complete at the counter',
    text: 'Built-in POS, EMI integration, warranty and RMA management, plus sell-in vs sell-out reporting — giving every tier exactly what it needs, no more and no less.',
  },
  {
    kicker: 'AI you can afford',
    text: 'Competitors make vague AI claims. We start with immediately useful features, then scale to forecasting, pricing and fraud detection — without overwhelming your team or budget.',
  },
];

/* ------------------------------------------------------------------ *
 * Catalogue
 * ------------------------------------------------------------------ */

export const products: Product[] = [
  {
    slug: 'dms',
    name: 'PPV DMS',
    fullName: 'Dealer Management System',
    status: 'live',
    tagline:
      'A real-time, role-aware business engine built for the complexities of multi-tier handset distribution.',
    positioning: 'Not software. A business engine.',
    summary:
      'PPV DMS defines the features, role-based access, AI capabilities and end-to-end process flow for multi-tier handset distribution — from supplier catalog to customer warranty. Unlike generic ERPs or legacy automotive DMS platforms, it is designed around four distinct roles on a single, event-driven data core that updates in real time — not overnight.',
    metrics: [
      { value: '4', label: 'Roles, each with isolated data' },
      { value: '6', label: 'Core modules on one data core' },
      { value: '3', label: 'AI phases, 11 features' },
      { value: '2', label: 'Channels, standard & direct' },
    ],
    highlights: [
      'IMEI-level unit tracking',
      'RBAC enforced at the data layer',
      'POS with EMI integration',
      'Warranty & RMA workflow',
      'Tiered ledgers & scheme engine',
      'Phased AI roadmap',
    ],
    live: [
      {
        label: 'Admin portal',
        url: 'https://dms.platformplayventure.com',
        blurb: 'Supplier, distributor, dealer and direct-dealer dashboards.',
        accounts: [
          { role: 'Admin (super admin)', emails: ['admin@apexglobal.com'] },
          { role: 'Supplier', emails: ['supplier@example.com'] },
          { role: 'Distributor', emails: ['distributor.a@example.com', 'distributor.b@example.com'] },
          {
            role: 'Dealer',
            emails: [
              'dealer.a1@example.com',
              'dealer.a2@example.com',
              'dealer.a3@example.com',
              'dealer.b1@example.com',
              'dealer.b2@example.com',
            ],
          },
          { role: 'Direct-Dealer', emails: ['directdealer.1@example.com', 'directdealer.2@example.com'] },
        ],
      },
      {
        label: 'Storefront',
        url: 'https://ecommerce-dms.platformplayventure.com',
        blurb: 'The customer-facing commerce layer on the same data core.',
        accounts: [
          {
            role: 'Customer',
            emails: ['customer@example.com', 'customer2@example.com'],
            note: 'Rahul Sharma · Priya Patel',
          },
        ],
      },
    ],
    demoPassword: 'password123',
    demoNote:
      'The login screen also carries quick-fill buttons for the main roles, so you can sign in without typing anything.',
    closing: 'One channel. One operating core. One clearer way to grow.',
  },
  {
    slug: 'hrms',
    name: 'PPV HRMS',
    fullName: 'Human Resource Management System',
    status: 'live',
    tagline: 'Digitizing the complete employee lifecycle — from recruitment to retirement.',
    positioning: 'One platform. Complete workforce management.',
    summary:
      'PPV HRMS digitizes and automates the complete employee lifecycle through a fully integrated ecosystem of HR modules. Instead of spreadsheets, standalone tools and duplicate data entry, it gives an organisation one centralized system for its workforce — with role-based access so sensitive information stays with the right people.',
    metrics: [
      { value: '10+', label: 'Integrated modules' },
      { value: '05', label: 'Capability categories' },
      { value: '15+', label: 'Functional modules' },
      { value: '08', label: 'Access roles' },
    ],
    highlights: [
      'Employee master records',
      'Attendance & leave',
      'Payroll processing',
      'Recruitment & onboarding',
      'Performance management',
      'Self-service portal',
    ],
    live: [
      {
        label: 'HRMS platform',
        url: 'https://hrms.ursdigitally.com',
        blurb: 'The full HR platform — employee records, attendance, leave, payroll and self-service.',
        accounts: [],
      },
    ],
    demoNote: 'Demo logins for the HR platform are shared on request.',
    closing: 'Smarter processes. Better experiences. Stronger workforce.',
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
