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
import EventFilter from './event-filter.js';
import EventNormalizer from './event-normalizer.js';
import Aggregagotron from './aggregagotron.js';
import OutputWriter from './output-writer.js';

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

const aggregagotron = new Aggregagotron();
const outputWriter = new OutputWriter(outdir);
const lineHandler = buildLineHandler(aggregagotron);

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
  const results = aggregagotron.results();
  outputWriter.write(results);

});

fs.createReadStream(infile)
  .pipe(gunzip())
  .pipe(extract);

// some fascinating construction
function buildLineHandler(aggregagotron){
  const lineParser = new LineParser();
  const eventFilter = new EventFilter();
  const eventNormalizer = new EventNormalizer();
  return new LineHandler(lineParser, eventFilter, eventNormalizer, aggregagotron);
}
