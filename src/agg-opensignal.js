'use strict';
// Aggregates data for the open signal phone project
/*
data looks like this:
{
  handsetPickups: { date1: count1, date2: count2, ...},
  handsetContent: {
    peoples_homes: { date1: count1, date2: count2, ...}
    ...
  }
  remoteContent: { ...}
  remoteMenu: { ... }
}
*/

const BASE_RESULT = {
  handsetPickups: {},
  handsetContent: {
    peoples_homes: {},
    conversations: {},
    missed_connections: {}
  },
  remoteContent: {
    peoples_homes: {},
    conversations: {},
    missed_connections: {}
  },
  remoteMenu: {}
};

class AggOpenSignal {

  constructor(){
    //dumb person's clone
    this.data = JSON.parse(JSON.stringify(BASE_RESULT));
  }

  apply(event) {
    if(event.name.match(/hold_the_phone_main/) && this._channelIsHandset(event)){
      this._handsetPickup(event);
    }
    else if(event.name.match(/hold_the_phone_incoming/)){
      //TODO: Discriminate on "inbound extension"?
      this._remoteMenu(event);
    }
    else if(this._isContentEvent(event)){
      if(this._channelIsHandset(event)){
        this._handsetContent(event);
      }
      else{
        this._remoteContent(event);
      }
    }
  }

  result(){
    return this.data;
  }

  _isContentEvent(event){
    const events =  ['peoples_homes', 'conversations', 'missed_connections'];
    return events.includes(event.name);
  }

  _channelIsHandset(event){
    return event.channel.match(/SIP\/660-/);
  }

  _handsetContent(event){
    if(!this.data.handsetContent[event.name][event.date]){
      this.data.handsetContent[event.name][event.date] = 0;
    }
    this.data.handsetContent[event.name][event.date]++;
  }

  _remoteMenu(event){
    if(!this.data.remoteMenu[event.date]){
      this.data.remoteMenu[event.date] = 0;
    }
    this.data.remoteMenu[event.date]++;
  }

  _remoteContent(event){
    if(!this.data.remoteContent[event.name][event.date]){
      this.data.remoteContent[event.name][event.date] = 0;
    }
    this.data.remoteContent[event.name][event.date]++;
  }

  _handsetPickup(event){
    if(!this.data.handsetPickups[event.date]){
      this.data.handsetPickups[event.date] = 0;
    }
    this.data.handsetPickups[event.date]++;
  }
}

export default AggOpenSignal;
