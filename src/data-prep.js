'use strict';

// A utility to do data prep and analysis of all metrics in advance
// of any additional visualization.

import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
import fs from 'fs';
import tar from 'tar-stream';
import gunzip from 'gunzip-maybe';
import FileInTarHandler from './file-in-tar.js';
import LineParser from './line-parser.js';
import LineHandler from './line-handler.js';

const infile = argv.in || argv.i;
const outdir = argv.outdir || argv.o;

function usage() {
  console.log("");
  console.log("Usage:");
  console.log("");
  console.log("node data-prep.js --in <all-metrics.tgz> --outdir <dir>");
  console.log("");
  process.exit(1);
}

if (!infile || !outdir) {
  usage();
}

console.log(`reading from ${infile} and outputting to ${outdir}`);

const extract = tar.extract()

const lineParser = new LineParser();
const lineHandler = new LineHandler(lineParser);

extract.on('entry', (header, stream, next) => {
  const fileHandler = new FileInTarHandler({
    extract,
    next,
    lineHandler
  });
  fileHandler.doEntry(header, stream)
});

extract.on('finish', function() {
  console.log('All done.');
  //TODO: Flush in-memory aggregators to files
});

fs.createReadStream(infile)
  .pipe(gunzip())
  .pipe(extract);
