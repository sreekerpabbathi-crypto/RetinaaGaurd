/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B19',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#1C2541',
          700: '#2A3B66',
        },
        clinical: {
          teal: '#0D9488',
          cyan: '#06B6D4',
          slate: '#334155',
          border: '#E2E8F0',
          muted: '#64748B',
        },
        dr: {
          0: '#10B981', // No DR - Emerald
          1: '#F59E0B', // Mild - Amber
          2: '#F97316', // Moderate - Orange
          3: '#EF4444', // Severe - Red
          4: '#9333EA', // Proliferative - Purple/Crimson
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'clinical-focus': '0 0 0 3px rgba(13, 148, 136, 0.25)',
      }
    },
  },
  plugins: [],
}
