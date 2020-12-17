'use strict';

// by month, by fone to event count.
// {
//    2020-10: {
//       somephone: {
//          someevent: 12,
//          other: 9
//       },
//       nextfone: { someevent: 99, other: 2 }
//    }
// }
class AggPerFone {
  constructor(){
    this.data = {};
  }

  apply(event){
    const mon = event.date.match(/\d\d\d\d-\d\d/);
    const monthObj = this._getMonth(mon);
    const fone = this._getFone(monthObj, event.extension);
    this._inc(fone, event.name);
  }

  _getMonth(month){
    if(!this.data[month]) this.data[month] = {};
    return this.data[month];
  }

  _getFone(monthObj, fone){
    if(!monthObj[fone]) monthObj[fone] = {};
    return monthObj[fone];
  }

  _inc(fone, eventName){
    if(!fone[eventName]) fone[eventName] = 0;
    return fone[eventName]++;
  }

  result(){
    return this.data;
  }

}

export default AggPerFone;
