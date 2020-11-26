'use strict';

import goodMetricNames from './good-metric-names.json';

// Top level filter for just tossing out data.
class EventFilter {

  pass(event){
    return event.name in goodMetricNames;
  }

  fail(event){
    return !this.pass(event);
  }

}

export default EventFilter;
