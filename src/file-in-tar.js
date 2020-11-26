'use strict';

// const readline = require('readline');
import readline from 'readline'

class FileInTarHandler {

  constructor(extract){
    this.extract = extract;
  }

  async doEntry(header, stream, next) {
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

}

export default FileInTarHandler;
