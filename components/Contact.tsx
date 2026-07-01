import SectionHeader from "../components/SectionHeader";
import { WHATSAPP_URL } from "../lib/constants";

const CONTACT_ITEMS = [
  { icon: "💬", label: "WhatsApp", value: "+91 98765 43210", href: WHATSAPP_URL },
  { icon: "📧", label: "Email", value: "hello@brindhavanamfarms.com", href: "mailto:hello@brindhavanamfarms.com" },
  { icon: "📍", label: "Farm Address", value: "Medchal Road, Hyderabad – 500078", href: "#" },
  { icon: "🕐", label: "Delivery Hours", value: "5:00 AM – 7:00 AM, 7 days a week", href: "#" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-[5%] bg-cream">
      <SectionHeader
        eyebrow="Get in Touch"
        title="We'd Love to Hear from You"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Info */}
        <div className="reveal">
          <p className="text-base font-light leading-relaxed mb-8" style={{ color: "#6b6b6b" }}>
            Whether you want to subscribe, ask a question, or visit our farm — we're just a message
            away. Most queries are answered within two hours on WhatsApp.
          </p>
          <div className="space-y-3 mb-8">
            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(31,77,58,0.08)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4
                    className="text-xs font-medium uppercase tracking-wider mb-0.5"
                    style={{ color: "#9a9a9a" }}
                  >
                    {item.label}
                  </h4>
                  <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "#25d366" }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        {/* Map placeholder */}
        <div
          className="reveal rounded-3xl h-80 flex flex-col items-center justify-center gap-4 text-white/60 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg,#1a3d2b,#2d5c3f,#4a8a5c)",
          }}
        >
          <span className="text-5xl">📍</span>
          <div className="text-center">
            <p className="text-white/90 font-medium mb-1">Brindhavanam Farms</p>
            <p className="text-sm">Medchal Road, Hyderabad</p>
          </div>
        </div>
      </div>
    </section>
  );
}