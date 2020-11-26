'use strict';

// Every metrics line from a tarball goes through this class.
// This is the start of the per-line processing pipeline.
class LineHandler {

  constructor(lineParser){
    this.lineParser = lineParser;
  }

  apply(line){
    // console.log(line);
    const event = this.lineParser.parse(line);
    console.log(event);
  }

}

export default LineHandler;
