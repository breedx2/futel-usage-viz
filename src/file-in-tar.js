'use strict';

// const readline = require('readline');
import readline from 'readline'

// A new one of these is created and used for each entry in the tarball
class FileInTarHandler {

  constructor(opts) {
    Object.assign(this, opts);
  }

  async doEntry(header, stream) {
    // header is the tar header
    // stream is the content body (might be an empty stream)
    const self = this;
    const lineReader = readline.createInterface({
      input: stream
    });

    console.log(header);
    stream.on('end', function() {
      self.next() // gotta call this to keep the pipeline goin'
    })

    stream.resume() // just auto drain the stream

    for await (const line of lineReader) {
      self.lineHandler.apply(line);
    }
  }

}

export default FileInTarHandler;
