'use strict';

import goodMetricNames from './good-metric-names.json';

// Top level filter for just tossing out data.
class EventFilter {

  pass(event){
    //return goodMetricNames.includes(event.name);
    // Karl wants all events.....
    return true;
  }

  fail(event){
    return !this.pass(event);
  }

}

export default EventFilter;
