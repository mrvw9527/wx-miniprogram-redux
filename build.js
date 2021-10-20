const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const chalk = require("react-dev-utils/chalk");

const RollupConfig = (inputFile, outputFile) => ({
  input: inputFile,
  output: {
    file: outputFile,
    format: "cjs",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  ],
})

const rollupConfig = RollupConfig('es/index.js', path.join('dist', 'index.js'));
const { output: outputOption, ...inputOption } = rollupConfig;

rollup
  .rollup(inputOption)
  .then((bundle) => bundle.write(outputOption))
  .then(() => console.log(chalk.green("Compiled successfully.\n")));
