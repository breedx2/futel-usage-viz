'use strict';

// Every metrics line from all files in a tarball goes through this class.
// This is the start of the per-line processing pipeline.
class LineHandler {

  constructor(lineParser, eventFilter, normalizer, aggregagotron){
    this.lineParser = lineParser;
    this.eventFilter = eventFilter;
    this.normalizer = normalizer;
    this.aggregagotron = aggregagotron;
  }

  apply(line){
    const event = this.lineParser.parse(line);
    if(this.eventFilter.fail(event)){
      return;
    }
    const normalizedEvent = this.normalizer.normalize(event);
    this.aggregagotron.apply(normalizedEvent);
  }

}

export default LineHandler;
