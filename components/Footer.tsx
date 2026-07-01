import { WHATSAPP_URL } from "@/lib/constants";

const QUICK_LINKS = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "How It Works", href: "#how" },
    { label: "Referral Program", href: "#referral" },
];

const PRODUCT_LINKS = [
    { label: "Full Cream Milk", href: "#products" },
    { label: "Fresh Curd", href: "#products" },
    { label: "Artisan Paneer", href: "#products" },
    { label: "Desi Ghee", href: "#products" },
    { label: "Buttermilk", href: "#products" },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "#contact" },
];

const SOCIALS = [
    { icon: "📸", label: "Instagram", href: "#" },
    { icon: "📘", label: "Facebook", href: "#" },
    { icon: "💬", label: "WhatsApp", href: WHATSAPP_URL },
    { icon: "▶️", label: "YouTube", href: "#" },
];

function FooterCol({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] mb-5"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>
                {title}
            </h4>
            <ul className="space-y-2.5 list-none">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="text-sm transition-colors duration-200 hover:text-gold"
                            style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer style={{ background: "#163728" }}>
            <div className="px-[5%] pt-16 pb-8">
                {/* Top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <span
                            className="font-serif text-xl font-semibold block mb-3"
                            style={{ color: "#fff" }}
                        >
                            Brindhavanam Farms
                        </span>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                            Farm-fresh dairy delivered in glass, not plastic. Committed to sustainability,
                            local farmers, and your family's health since 2022.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-2.5">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.href.startsWith("http") ? "_blank" : undefined}
                                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.background = "#D4AF37";
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D4AF37";
                                        (e.currentTarget as HTMLAnchorElement).style.color = "#163728";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                                        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterCol title="Quick Links" links={QUICK_LINKS} />
                    <FooterCol title="Products" links={PRODUCT_LINKS} />
                    <FooterCol title="Legal" links={LEGAL_LINKS} />
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                        © {new Date().getFullYear()} Brindhavanam Farms. All rights reserved. Made with ❤️ in Hyderabad.
                    </p>
                    <div className="flex gap-5">
                        {[{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }].map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="text-xs transition-colors duration-200 hover:text-white"
                                style={{ color: "rgba(255,255,255,0.25)" }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
