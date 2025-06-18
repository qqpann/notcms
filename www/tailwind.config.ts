import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        silver:
          "radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 72%, rgba(255, 255, 255, 0) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "shiny-card": "inset 0 -80px 96px 0 rgba(255, 255, 255, 0.08)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      gridTemplateColumns: {
        "46": "repeat(46, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-23": "span 23 / span 23",
        "span-18": "span 18 / span 18",
        "span-28": "span 28 / span 28",
      },
      fontFamily: {
        Roobert: ["var(--font-Roobert)", "Roobert", "sans-serif"],
      },
      fontWeight: {
        550: "550",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".border-silver": {
          position: "relative",
          zIndex: "0",
        },
        ".border-silver::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "0.5px", // ボーダーの幅
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0))",
          WebkitMask:
            "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          zIndex: "-1",
        },
        ".border-silver-gradient": {
          borderImage:
            "linear-gradient(to bottom, transparent 0%, rgb(39 39 42) 50%, transparent 100%) 1",
        },
      });
    }),
  ],
};
export default config;
