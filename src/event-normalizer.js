'use strict';

import mappings from './event-name-mappings.json';

class EventNormalizer {

  normalize(event){
    const mappedName = mappings[event.name];
    if(!mappedName){
      return event;
    }
    const result = JSON.parse(JSON.stringify(event));
    result.name = mappedName;
    return result;
  }

}

export default EventNormalizer;
