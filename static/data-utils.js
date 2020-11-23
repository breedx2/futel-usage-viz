
function omitIncoming(data){
  return data.filter(isNotIncoming);
}

function isIncoming(data){
  //TODO: Figure out how to actually discriminate correctly
  return false;
}

function isNotIncoming(data){
  return !isIncoming(data);
}

function eventNames(data){
  return [...data.reduce( (acc,val) => {
    acc.add(val.event);
    return acc;
  }, new Set())].sort();
}

function byHour(events){
  const result = emptyHourlyArray();
  events.forEach(event => {
    result[event.hour]++;
  })
  return result;
}

function emptyHourlyArray(){
  return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
}

function yearSummary(data){
  return data.reduce((acc,event) => {
    const year = event.timestamp.match(/^\d\d\d\d/);
    if(!acc[year]){
      acc[year] = {};
    }
    if(!acc[year][event.event]){
      acc[year][event.event] = 0;
    }
    acc[year][event.event]++;
    return acc;
  }, {});
}

function filterEvents(data, eventName){
  if(!eventName) return data;
  return data.filter(x => x.event === eventName);
}
