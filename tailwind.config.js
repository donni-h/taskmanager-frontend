/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "halloween",
      {
        mytheme: {
          "primary": "#f9e2ae",
          "secondary": "#aa6ed8",
          "accent": "#ed5ee6",
          "neutral": "#222835",
          "base-100": "#2B3140",
          "info": "#87B2E3",
          "success": "#15C1A7",
          "warning": "#FCC34F",
          "error": "#EA411F",
        }
      },
    ]
  },
  plugins: [require("daisyui")],
}
