import { resolve, relative, extname } from 'path';

import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

import pkg from '../package.json';

const src = `${resolve(__dirname, '..', 'src')}/`;

/** Config Builder Helper */
const buildConfig = ({

  /** Set path for base tsconfig.json to use */
  tsconfig = './tsconfig.json',

  /** Override tsConfig options */
  tsconfigOverride = {},

  /** Choose if must preserve modules */
  preserveModules = false,

  /** Append extra plugins */
  plugins = [],

  /** Check if must use cache */
  cache = false,

  /** Get Output files */
  output = [],

  /** Build the source map */
  sourcemap = true,

  ...rest

} = {}) => ({

  /** Set the default entry */
  input: 'src/index.tsx',

  /** Keep externals from peerDependencies */
  external: Object.keys(pkg.peerDependencies || {}),

  /** Append Plugins */
  plugins: [
    /** Compile Typescript */
    typescript({
      /** Set the tsconfig file */
      tsconfig,
      /** Override mandatory ts options */
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
          target: 'ES5',
          noEmit: true,
          ...tsconfigOverride
        }
      },
      /** Disable/enable cache */
      clean: !cache
    }),

    /** User Node Module Resolver */
    nodeResolve(),


    /** Use PostCSS */
    postcss({
      config: {
        path: './postcss.config.js'
      }
    }),

    /** Extra plugins */
    ...plugins
  ],

  /** Set Options by Args */
  preserveModules,

  cache,

  output: output.map((dest) => {
    /** Enable/Disable the sourceMap for all output */
    dest.sourcemap = sourcemap;
    return dest;
  }),

  ...rest

})

/** Export Rollup Configuration */
export default [
  /** Build Modules */
  buildConfig({
    /** Build d.ts files */
    tsconfigOverride: { target: 'ES2017' },
    /** Set the Output */
    output: [{
      dir: 'dist/module',
      format: 'esm',
      chunkFileNames: '[name].js',
      hoistTransitiveImports: false
    }],
    /**
     * Use a custom function to preserve modules
     * component paths and files, and bundle orr
     * node modules external function into a single files
     */
    manualChunks: (id, help) => {
      /** Put node modules into helpers */
      if (/node_modules/.test(id)) {
        return 'external-helpers/index'
      };
      /** Get relative path, stripping extension */
      const relativePath = relative(src, id).replace(extname(id), '');
      /** Return the relative module path */
      return relativePath;
    }
  }),

  /** Build Lib */
  buildConfig({
    /** Set the Output */
    output: [{
      file: 'dist/lib/index.js',
      format: 'cjs',
      exports: 'auto'
    }]
  })
];
