import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./context/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    DEFAULT: "#1F4D3A",
                    light: "#2a6650",
                    dark: "#163728",
                    olive: "#6B8E23",
                },
                cream: {
                    DEFAULT: "#F8F6F0",
                    dark: "#ede9df",
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    light: "#e8c840",
                },
            },
            fontFamily: {
                serif: ["Playfair Display", "Georgia", "serif"],
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s ease-in-out infinite",
                "scroll-down": "scrollDown 2s ease-in-out infinite",
                "wa-pulse": "waPulse 3s ease-in-out infinite",
            },
            keyframes: {
                scrollDown: {
                    "0%": { transform: "scaleY(0)", transformOrigin: "top" },
                    "50%": { transform: "scaleY(1)", transformOrigin: "top" },
                    "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
                },
                waPulse: {
                    "0%, 100%": { boxShadow: "0 4px 24px rgba(37,211,102,0.4)" },
                    "50%": {
                        boxShadow:
                            "0 4px 40px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.1)",
                    },
                },
            },
            backdropBlur: {
                xs: "4px",
            },
        },
    },
    plugins: [],
};
export default config;