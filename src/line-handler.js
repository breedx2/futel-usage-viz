'use strict';

// Every metrics line from all files in a tarball goes through this class.
// This is the start of the per-line processing pipeline.
class LineHandler {

  constructor(lineParser, eventFilter, aggregagotron){
    this.lineParser = lineParser;
    this.eventFilter = eventFilter;
    this.aggregagotron = aggregagotron;
  }

  apply(line){
    const event = this.lineParser.parse(line);
    if(this.eventFilter.fail(event)){
      return;
    }
    this.aggregagotron.apply(event);
  }

}

export default LineHandler;
