const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Minimize bundle size
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      toplevel: true,
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    compress: {
      reduce_funcs: false,
      drop_console: true,        // removes all console.log
      pure_getters: true,
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
  },
};

// Only bundle assets that are explicitly required
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(
    (ext) => !['ttf', 'otf', 'woff', 'woff2'].includes(ext) // remove unused font formats
  ),
};

module.exports = config;