'use strict';

// A utility to do data prep and analysis of all metrics in advance
// of any additional visualization.

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const tar = require('tar-stream');
const gunzip = require('gunzip-maybe');

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

extract.on('entry', function(header, stream, next) {
  // header is the tar header
  // stream is the content body (might be an empty stream)
  // call next when you are done with this entry

  console.log(header);
  stream.on('end', function() {
    next() // ready for next entry
  })

  stream.resume() // just auto drain the stream
})

extract.on('finish', function() {
  // all entries read
})

fs.createReadStream(infile).pipe(gunzip()).pipe(extract);
