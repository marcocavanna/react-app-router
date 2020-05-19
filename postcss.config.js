module.exports = {

  plugins: {
    'postcss-import'             : {},
    autoprefixer                 : {},
    'css-mqpacker'               : {},
    'css-declaration-sorter'     : { order: 'alphabetical' },
    'postcss-discard-duplicates' : {},
    'postcss-import-url'         : {},

    ...(process.env.NODE_ENV === 'production'

      /** Plugins for Production Mode Only */
      ? { cssnano: {} }

      /** Plugins for Development Mode Only */
      : { 'postcss-discard-comments': {}, 'postcss-single-line': {} }

    )

  }
};
