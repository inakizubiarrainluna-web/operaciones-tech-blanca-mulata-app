import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        bm: {
          crudo: '#F5F0E8',
          habano: '#C4A882',
          chocolate: '#6B4C3B',
          tierra: '#8B6F5E',
          blanco: '#FDFBF7',
        },
      },
    },
  },
  plugins: [],
};
export default config;
