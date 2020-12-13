'use strict';

import fs from 'fs';
const fsPromises = fs.promises;
import JsonWriter from './json-writer.js';

class OutputWriter {

  constructor(outputDir) {
    this.outputDir = outputDir;
    // FIXME: lazy non-injection
    this.delegates = {
      'eventsPerDate': new JsonWriter(outputDir),
      'eventsPerMonth': new JsonWriter(outputDir),
      'eventsPerYear': new JsonWriter(outputDir),
      'openSignal': new JsonWriter(outputDir),
      'eventsPerHourOfDay': new JsonWriter(outputDir),
    }
  }

  async write(results) {
    await this._prepareOutputDir();
    return Promise.all(
      Object.entries(results)
        .map(entry => this._doWrite(entry[0], entry[1]))
    );
  }

  async _prepareOutputDir() {
    const dir = this.outputDir;
    return fsPromises.access(dir, fs.constants.R_OK | fs.constants.W_OK)
      .then(() => {
        console.log(`Output directory ${dir} already exists. Cool.`);
      })
      .catch(() => {
        console.log(`Trying to create output dir ${dir}...`);
        return fsPromises.mkdir(dir).then(() => console.log(`Created ${dir}`));
      });
  }

  async _doWrite(name, results) {
    const delegate = this.delegates[name];
    if(!delegate){
      return console.log(`*** WARNING: NO SUCH DELEGATE WRITER: ${name}`);
    }
    console.log(`Doing output for ${name}`);
    return delegate.write(name, results);
  }
}

export default OutputWriter;
