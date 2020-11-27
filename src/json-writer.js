'use strict';

import fs from 'fs';
const fsPromises = fs.promises;

class JsonWriter {

  constructor(outputDir){
    this.outputDir = outputDir;
  }

  async write(name, results){
    const filename = `${this.outputDir}/${name}.json`;
    return fsPromises.writeFile(filename, JSON.stringify(results));
  }

}

export default JsonWriter;
