/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom sci-fi colors
        "neon-orange": "#FF6B2B",
        "neon-red": "#FF3131",
        "neon-amber": "#FFA500",
        "cosmic-blue": "#0A1628",
        "space-dark": "#050810",
        "panel-bg": "rgba(10, 22, 40, 0.7)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(255, 107, 43, 0.3), 0 0 30px rgba(255, 107, 43, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 107, 43, 0.8), 0 0 60px rgba(255, 107, 43, 0.3)",
          },
        },
        "glow-pulse-red": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(255, 49, 49, 0.3), 0 0 30px rgba(255, 49, 49, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 49, 49, 0.8), 0 0 60px rgba(255, 49, 49, 0.3)",
          },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "10%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "30%": { opacity: "0.5" },
          "40%": { opacity: "1" },
          "60%": { opacity: "0.3" },
          "70%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "boot-flicker": {
          "0%": { opacity: "0" },
          "5%": { opacity: "1" },
          "10%": { opacity: "0" },
          "15%": { opacity: "1" },
          "20%": { opacity: "0.5" },
          "25%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "text-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glow-pulse-red": "glow-pulse-red 2s ease-in-out infinite",
        flicker: "flicker 0.5s linear",
        "scan-line": "scan-line 3s linear infinite",
        "boot-flicker": "boot-flicker 0.8s ease-in-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "text-blink": "text-blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
