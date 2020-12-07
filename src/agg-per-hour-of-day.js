'use strict';

class AggPerHourOfDay {

  constructor() {
    this.data = {};
  }

  apply(event) {
    const hour = event.hour;
    if(!this.data[hour]){
      this.data[hour] = {};
    }
    if(!this.data[hour][event.name]){
      this.data[hour][event.name] = 0;
    }
    this.data[hour][event.name]++;
  }

  result(){
    return this.data;
  }

}

export default AggPerHourOfDay;
