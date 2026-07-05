import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/games/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#13201a",
        moss: "#3f7d53",
        leaf: "#7ac46b",
        peach: "#f3a469",
        mist: "#edf7f0",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(19, 32, 26, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
