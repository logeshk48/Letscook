// All site copy lives here. Edit text without touching components.

export const site = {
  name: "Let's cook Technologies",
  tagline: "Build Beyond Ideas",
  description:
    "Turn your ideas into powerful digital solutions — modern websites, Android & iOS apps, and secure scalable applications.",
  url: "https://letscooktech.com",
  email: "letscooktechnologies@gmail.com",
  phoneDisplay: "+91 70946 00771",
  phoneE164: "917094600771",
  instagram: "letscook_tech",
  linkedin: "https://www.linkedin.com/company/let-s-co-ok/",
  location: "Tamil Nadu, India",
  coords: `11° 07' 37" N   78° 39' 25" E`,
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.phoneE164}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const navLinks = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "recipe", label: "Recipe" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export type Service = {
  name: string;
  tag: string;
  text: string;
  points: string[];
};

export const services: Service[] = [
  {
    name: "Websites",
    tag: "Modern, responsive & fast",
    text: "Marketing sites, portfolios and business websites that load quickly, look sharp on every screen and are built to rank.",
    points: ["Responsive on all devices", "SEO-ready structure", "Fast, clean code"],
  },
  {
    name: "Android & iOS apps",
    tag: "Powerful apps",
    text: "Cross-platform mobile apps with smooth interfaces, real-time data and the polish users expect from day one.",
    points: ["Android & iOS from one codebase", "Push notifications & offline mode", "Play Store / App Store support"],
  },
  {
    name: "Applications",
    tag: "Dynamic, secure & scalable",
    text: "Dashboards, portals, billing systems and internal tools engineered around how your team actually works.",
    points: ["Role-based access & auth", "APIs and integrations", "Built to scale with you"],
  },
  {
    name: "UI / UX design",
    tag: "Interfaces people enjoy",
    text: "Wireframes, prototypes and design systems that turn a rough idea into something clear, usable and on-brand.",
    points: ["Wireframes & prototypes", "Design systems", "Usability-first layouts"],
  },
  {
    name: "Student projects",
    tag: "Final year, done right",
    text: "End-to-end academic project support: a working build, clean documentation and a walkthrough so you can defend it confidently.",
    points: ["Source code + documentation", "Live demo setup", "One-to-one explanation"],
  },
  {
    name: "Support & maintenance",
    tag: "We stay after launch",
    text: "Hosting, updates, bug fixes and improvements so the thing we built keeps working long after handover.",
    points: ["Hosting & domain setup", "Monitoring & backups", "Ongoing improvements"],
  },
];

export const marqueeItems = [
  "Websites",
  "Android & iOS apps",
  "Web applications",
  "UI / UX design",
  "E-commerce",
  "Dashboards",
  "API integrations",
  "Student projects",
  "Hosting & support",
];

export const buildLog: { tone: "dim" | "ok" | "acc"; text: string }[] = [
  { tone: "dim", text: '$ letscook new --idea "your-idea"' },
  { tone: "ok", text: "✓ problem understood · audience: businesses, startups, students" },
  { tone: "ok", text: "✓ scope + screens + timeline → fixed quote approved" },
  { tone: "acc", text: "▸ cooking in focused sprints · preview link every sprint" },
  { tone: "ok", text: "✓ launched · code, accounts & files handed over" },
  { tone: "dim", text: "$ letscook support --after-launch" },
];

export const recipe = [
  {
    title: "Share the idea",
    stage: "Prep",
    text: "A short call or chat where you tell us what you want to build and who it is for. No jargon needed.",
    tags: ["Call or chat", "No jargon"],
  },
  {
    title: "Plan the recipe",
    stage: "Measure",
    text: "We turn it into a clear scope: features, screens, timeline and a fixed quote you approve before anything starts.",
    tags: ["Fixed quote", "Scope + timeline"],
  },
  {
    title: "Cook it",
    stage: "Method",
    text: "Design and development in focused sprints, with previews you can click and comment on as it comes together.",
    tags: ["Clickable previews", "Short sprints"],
  },
  {
    title: "Serve & support",
    stage: "Serves",
    text: "We launch it, hand over every account and file, and stay available for updates and fixes.",
    tags: ["Full handover", "Ongoing support"],
  },
];

export const stats = [
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 100, suffix: "%", label: "On-time handover" },
  { value: 24, suffix: "H", label: "Average reply time" },
  { value: 3, suffix: "", label: "Audiences served" },
];

export const reasons = [
  { key: "/ingredients", title: "Ideas first, code second", text: "We start with the problem you are solving, not the framework we want to use. The build follows the idea." },
  { key: "/heat", title: "Fast, never sloppy", text: "Short, focused sprints with something you can click at the end of each one. No six-week silences." },
  { key: "/portion", title: "Pricing that fits", text: "Startup, student and business budgets are different. Our scoping reflects that honestly." },
  { key: "/takeaway", title: "You own everything", text: "Full source code, accounts and assets are handed over at the end. No lock-in, no hostage hosting." },
];

export type Project = {
  kind: string;
  title: string;
  text: string;
  results: string[];
  glyph: string;
  metricLabel: string;
  metricValue: string;
  image?: string; // optional: put a screenshot in /public/work and set "/work/file.webp"
};

export const projects: Project[] = [
  { kind: "Web application", title: "Retail Billing Dashboard", image: "/work/billing.webp", text: "Inventory, invoicing and daily sales reporting for a multi-branch retail store.", results: ["Billing time cut by 60%", "Live stock across 3 branches"], glyph: "₹", metricLabel: "Billing time", metricValue: "−60%" },
  { kind: "Android & iOS", title: "Campus Events App", image: "/work/events.webp", text: "Event discovery, registration and QR check-in built for a college community.", results: ["2,400+ registrations", "Paperless check-in"], glyph: "QR", metricLabel: "Registrations", metricValue: "2,400+" },
  { kind: "Website", title: "Studio Portfolio Site", image: "/work/portfolio.webp", text: "A fast, image-heavy portfolio with a CMS the owner updates without calling us.", results: ["1.2s load time", "Self-managed content"], glyph: "1.2s", metricLabel: "Load time", metricValue: "1.2s" },
  { kind: "Web application", title: "Clinic Appointment Portal", image: "/work/clinic.webp", text: "Online booking, doctor schedules and automated WhatsApp reminders.", results: ["70% fewer no-shows", "Reminders on autopilot"], glyph: "+", metricLabel: "No-shows", metricValue: "−70%" },
  { kind: "Student project", title: "Final Year ML Project", image: "/work/ml.webp", text: "A crop-disease detection model with a simple web interface and full documentation.", results: ["Working demo + report", "Viva-ready walkthrough"], glyph: "ML", metricLabel: "Delivered", metricValue: "Demo + report" },
  { kind: "Web application", title: "Logistics Tracking Tool", image: "/work/logistics.webp", text: "Driver assignment, live trip status and delivery proof capture for a courier fleet.", results: ["Real-time trip status", "Digital proof of delivery"], glyph: "→", metricLabel: "Trip status", metricValue: "Real-time" },
];

export const testimonials = [
  { quote: "They understood what we needed before we could explain it properly. The dashboard replaced three spreadsheets and our staff picked it up in a day.", name: "Retail client", role: "Store owner, Coimbatore" },
  { quote: "Fast, responsive and genuinely invested in the product. We shipped our MVP in five weeks and got our first paying users the same month.", name: "Startup founder", role: "Early-stage SaaS" },
  { quote: "I actually understood my own project after their walkthrough. The documentation was better than anything I could have written.", name: "Final year student", role: "CSE, 2025 batch" },
];

export const faqs = [
  { q: "How long does a typical project take?", a: "A landing page or portfolio site is usually 1–2 weeks. A mobile app or custom web application typically runs 4–8 weeks depending on scope. You get a firm timeline with your quote before work starts." },
  { q: "How much will my project cost?", a: "It depends on scope, but we always quote a fixed price upfront after the scoping call, with no hourly surprises. Student projects and startup MVPs are priced differently from business builds." },
  { q: "Do I get the source code?", a: "Yes, always. Full source code, hosting accounts, domain access and design files are handed over to you at the end of the project. Nothing stays locked to us." },
  { q: "Can you work with my existing website or app?", a: "Absolutely. We take on redesigns, feature additions, performance fixes and rescue projects that another team left unfinished." },
  { q: "What happens after launch?", a: "Every project includes a support window for bug fixes. After that you can continue on a simple monthly maintenance plan or just call us when you need changes." },
];

export const needOptions = ["Website", "Mobile App", "Web Application", "UI / UX Design", "Student Project", "Something else"];
export const budgetOptions = ["Not sure yet", "Under ₹25,000", "₹25,000 – ₹75,000", "₹75,000 – ₹2,00,000", "₹2,00,000+"];
