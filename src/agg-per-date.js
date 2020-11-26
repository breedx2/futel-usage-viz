'use strict';

/*

data looks like this (should be sparse):

{
  2020-11-01: {
    event1: 12,
    event2: 12389,
    ...
  },
  2020-11-02: {
    event1: 8,
    some-other-event: 99
  },
  ...
}
*/
class AggPerDate {

  constructor(){
    this.data = {};
  }

  apply(event){
    this._inc(this._getDate(event.date), event.name);
    // console.log(this.data);
  }

  result(){
    return this.data;
  }

  _inc(date, name){
    if(!date[name]){
      date[name] = 0;
    }
    date[name]++;
  }

  _getDate(date){
    if(!this.data[date]){
      this.data[date] = {};
    }
    return this.data[date];
  }

}

export default AggPerDate;
