import { uglify } from 'rollup-plugin-uglify';

export default {
  input: "src/index.js",
  output: {
    file: "watchman.js",
    banner:"#! /usr/bin/env node"
  },
  plugins:[uglify(),]
};
