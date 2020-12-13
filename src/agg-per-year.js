'use strict';

/*

data looks like this (should be sparse):

{
  2020: {
    something: 4,
    someother: 12,
    ...
  },
  2019: {
    my-event: 18,
    some-other-event: 99
  },
  ...
}
*/
class AggPerYear {

  constructor(){
    this.data = {};
  }

  apply(event){
    const year = event.date.match(/^\d\d\d\d/);
    this._inc(this._getYear(year), event.name);
  }

  result(){
    return this.data;
  }

  _inc(year, name){
    if(!year[name]){
      year[name] = 0;
    }
    year[name]++;
  }

  _getYear(year){
    if(!this.data[year]){
      this.data[year] = {};
    }
    return this.data[year];
  }
}

export default AggPerYear;
