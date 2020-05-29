import { resolve, relative, extname, basename } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

// Get the Default Source Folder
const src = `${resolve(__dirname, 'src')}/`;

/** Config Builder Helper */
const buildConfig = ({

  /** Set path for base tsconfig.json to use */
  tsconfig = './tsconfig.json',

  /** Override tsConfig options */
  tsconfigOverride = {},

  /** Choose if must preserve components */
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
  input: 'src/index.ts',

  /** Keep externals from peerDependencies */
  external: Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {})),

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
      clean           : !cache
    }),

    /** User Node Module Resolver */
    nodeResolve(),

    /** Add the commonJS plugin */
    commonjs(),

    /** Extra plugins */
    ...plugins
  ],

  /** Set Options by Args */
  ...(!preserveModules ? {} : {
    /**
     * Instead using the original preserve modules
     * function of Rollup, must use a custom function to
     * preserve each components and files, and bundle each
     * external node_modules file into a single helper file
     */
    manualChunks: (id) => {
      /** Get filename and extension */
      const ext = extname(id);
      const filename = basename(id, ext);

      /** If id come from node_modules, put into external helpers */
      if (/node_modules/.test(id)) {
        return `external-modules/${filename}`;
      }

      /** Get relative file path, stripping original extension */
      const relativePath = relative(src, id).replace(ext, '');

      /** If relative it's outside source folder, place into external helpers */
      if (/\.\./.test(relativePath)) {
        return `external-modules/${filename}`;
      }

      /** Else if is internal, return the relative path */
      return relativePath;
    }
  }),

  cache,

  output: output.map((dest) => {
    /** Enable/Disable the sourceMap for all output */
    dest.sourcemap = sourcemap;
    return dest;
  }),

  ...rest

});

/** Export Rollup Configuration */
export default [
  /** Build Modules */
  buildConfig({
    /** Build d.ts files */
    tsconfigOverride: { target: 'ES2017' },
    /** Set the Output */
    output          : [
      {
        dir                   : 'dist/module',
        format                : 'esm',
        chunkFileNames        : '[name].js',
        hoistTransitiveImports: false,
        minifyInternalExports : false
      }
    ],
    /** Preserve original module */
    preserveModules: true
  }),

  /** Build Lib */
  buildConfig({
    /** Set the Output */
    output: [
      {
        file   : 'dist/lib/index.js',
        format : 'cjs'
      }
    ]
  }),
];
