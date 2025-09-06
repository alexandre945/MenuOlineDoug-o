/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],  // HTML e JS
  safelist: [
    'text-green-600',
    'text-red-600',
    'bg-yellow-300',
    'bg-white',
    'bg-red-500',
    'text-white',
    'text-gray-700',
    
    // espaçamentos e layout
    'p-2',
    'px-2',
    'py-1',
    'mx-2',
    'mt-2',
    'rounded',
    'rounded-sm',
    'shadow',
    'shadow-sm',
    'inline-block',
    'w-[calc(100%-1rem)]',
    'font-bold',
    'font-extrabold',
    'text-lg',
    'text-sm',
    'text-red-600',
    'text-gray-700',
    'text-white',],
  theme: {
    extend: {
           colors: {
        // mantendo os nomes padrão do Tailwind
        green: {
          600: '#2ee470ff'
        },
        red: {
          500: '#ef4444',
          600: '#dc2626'
        },
        yellow: {
          300: '#f1d549ff'
        },
        white: '#ffffff',
        gray: {
          700: '#374151'
        }
      },
    },
  },
  plugins: [],
}

