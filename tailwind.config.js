/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        border: "#334155",
        accent: "#6366F1",
        "accent-hover": "#4F46E5",
        primary: "#F1F5F9",
        muted: "#94A3B8",
        success: "#22C55E",
        danger: "#EF4444"
      }
    },
  },
  plugins: [],
}
