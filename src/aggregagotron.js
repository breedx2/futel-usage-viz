'use strict';

// consolidation umbrella for all aggregators
// there should really just be one of these for the whole run.

import AggPerDate from './agg-per-date.js';
import AggPerMonth from './agg-per-month.js';

class Aggregagotron {

  constructor(){
    // FIXME: lazy non-injection
    this.delegates = [
      new AggPerDate(),
      new AggPerMonth()
    ];
  }

  apply(event){
    this.delegates.forEach(d => d.apply(event));
  }

  //TODO: Hook this into some marshallers
  results(){
    console.log(JSON.stringify(this.delegates[1].result(), null, '\t'));
  }

}

export default Aggregagotron;
