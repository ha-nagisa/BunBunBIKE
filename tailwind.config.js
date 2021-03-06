module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      fill: (theme) => ({
        red: theme("colors.red.primary"),
      }),
      fontFamily: {
        logoFont: ["KelsonSans-BoldRU", "Arial", "sans-serif"],
      },
      padding: {
        harf: "50%",
      },
      colors: {
        white: "#ffffff",
        blue: {
          medium: "#005c98",
        },
        black: {
          light: "#262626",
          faded: "#00000059",
          base: "#333333",
        },
        gray: {
          base: "#616161",
          background: "#fafafa",
          primary: "#dbdbdb",
        },
        red: {
          primary: "#ed4956",
          background: "#ed4956",
        },
        logoColor: {
          base: "#FF9800",
          littleLight: "#FFAA32",
          light: "#FFBF66",
        },
      },
      width: {
        "19/20": "95%",
        "330px": "330px",
      },
      height: {
        "50vh": "50vh",
        "80vh": "80vh",
        "250px": "250px",
        "170px": "170px",
      },
      minWidth: {
        900: "900px",
        "300px": "300px",
      },
      maxWidth: {
        "540px": "540px",
        "350px": "350px",
      },
      maxHeight: {
        "600px": "600px",
      },
      boxShadow: {
        borderBottom: "0 4px 0px 0px rgba(0, 0, 0, 0.01)",
      },
      outline: {
        logoColor: "1px solid #FFBF66",
      },
      gridTemplateRows: {
        "280px": "280px",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
