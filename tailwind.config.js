/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bioclube: {
          dark: '#0B1726',     // Azul escuro profundo
          secondary: '#16324F', // Azul secundário
          amber: '#C58A32',     // Dourado/Âmbar do óleo
          light: '#F5F7FA',     // Fundo principal claro
          border: '#D9E0E7',    // Bordas
          textMain: '#17202A',  // Texto principal
          textSub: '#667085',   // Texto secundário
        }
      }
    },
  },
  plugins: [],
}