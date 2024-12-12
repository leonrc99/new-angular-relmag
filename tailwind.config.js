/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "hp-image": "url('https://front-rm.s3.us-east-1.amazonaws.com/assets/images/hp-image.png')",
        "sword-image": "url('https://front-rm.s3.us-east-1.amazonaws.com/assets/images/sword-image.png')",
      },
    },
  },
  plugins: [],
};
