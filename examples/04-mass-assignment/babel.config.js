module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // does not work in package.json.
        // https://github.com/babel/babel/issues/9849#issuecomment-592668815
        targets: {
          esmodules: true
        }
      }
    ]
  ]
};
