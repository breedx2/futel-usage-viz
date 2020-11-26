'use strict';

// A utility to do data prep and analysis of all metrics in advance
// of any additional visualization.

import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
import fs from 'fs';
import tar from 'tar-stream';
import gunzip from 'gunzip-maybe';
import readline from 'readline';
import FileInTarHandler from './file-in-tar.js';

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

async function handleTarballEntry(header, stream, next) {
  // header is the tar header
  // stream is the content body (might be an empty stream)
  // call next when you are done with this entry

  const lineReader = readline.createInterface({
    input: stream
  });

  console.log(header);
  stream.on('end', function() {
    next() // ready for next entry
  })

  stream.resume() // just auto drain the stream

  for await(const line of lineReader){
    console.log(line);
  }
}

extract.on('entry', handleTarballEntry);
extract.on('finish', function() {
  console.log('All done.');
  //TODO: Flush in-memory aggregators to files
});

fs.createReadStream(infile)
  .pipe(gunzip())
  .pipe(extract);
