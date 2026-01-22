import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'rc-shine': {
          '0%': { transform: 'translateX(-60%)' },
          '100%': { transform: 'translateX(140%)' },
        },
      },
      animation: {
        'rc-shine': 'rc-shine 1.8s ease-in-out infinite',
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
