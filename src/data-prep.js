'use strict';

// A utility to do data prep and analysis of all metrics in advance
// of any additional visualization.

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const infile = argv.in || argv.i;
const outdir = argv.outdir || argv.o;

function usage(){
  console.log("");
  console.log("Usage:");
  console.log("");
  console.log("node data-prep.js --in <all-metrics.tgz> --outdir <dir>");
  console.log("");
  process.exit(1);
}

if(!infile || !outdir){
    usage();
}

console.log(`reading from ${infile} and outputting to ${outdir}`);
