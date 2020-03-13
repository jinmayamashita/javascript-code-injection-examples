module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  parser: "babel-eslint",
  rules: {
    indent: ["error", 2],
      "import/prefer-default-export": "off",
      "indent": "off",
    },
  env: {
    "node": true,
  }
};
