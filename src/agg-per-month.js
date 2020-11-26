'use strict';

/*

data looks like this (should be sparse):

{
  2020-10: {
    something: 4,
    someother: 12,
    ...
  },
  2020-11: {
    my-event: 18,
    some-other-event: 99
  },
  ...
}
*/
class AggPerMonth {

  constructor(){
    this.data = {};
  }

  apply(event){
    const mon = event.date.match(/\d\d\d\d-\d\d/);
    this._inc(this._getMonth(mon), event.name);
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

  _getMonth(mon){
    if(!this.data[mon]){
      this.data[mon] = {};
    }
    return this.data[mon];
  }
}

export default AggPerMonth;
