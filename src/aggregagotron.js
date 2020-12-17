'use strict';

// consolidation umbrella for all aggregators
// there should really just be one of these for the whole run.

import AggPerDate from './agg-per-date.js';
import AggPerMonth from './agg-per-month.js';
import AggPerYear from './agg-per-year.js';
import AggPerFone from './agg-per-fone.js';
import AggOpenSignal from './agg-opensignal.js';
import AggPerHourOfDay from './agg-per-hour-of-day.js';

class Aggregagotron {

  constructor(){
    // FIXME: lazy non-injection
    this.delegates = {
      'eventsPerDate': new AggPerDate(),
      'eventsPerMonth': new AggPerMonth(),
      'eventsPerYear': new AggPerYear(),
      'eventsPerFone': new AggPerFone(),
      'openSignal': new AggOpenSignal(),
      'eventsPerHourOfDay': new AggPerHourOfDay()
    };
  }

  apply(event){
    Object.values(this.delegates).forEach(d => d.apply(event));
  }

  //TODO: Hook this into some marshallers
  results(){
    const result = {};
    for(const [k,v] of Object.entries(this.delegates)){
      result[k] = v.result();
    }
    return result;
  }

}

export default Aggregagotron;
