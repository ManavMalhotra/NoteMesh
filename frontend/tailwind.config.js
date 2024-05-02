/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#EEEEEF",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#292D32",
          secondary: "#EEEEEF",
          accent: "#CFFF47",
          neutral: "#001314",
          "base-100": "#F4F4F5",
          info: "#0084e9",
          success: "#268800",
          warning: "#f39300",
          error: "#e2224d",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
