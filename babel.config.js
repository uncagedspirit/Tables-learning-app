module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove all console.* calls in production
      ['transform-remove-console', { exclude: [] }],
    ],
    env: {
      production: {
        plugins: [
          'transform-remove-console',
          // If you use lodash, this tree-shakes it (install babel-plugin-lodash if used)
        ],
      },
    },
  };
};