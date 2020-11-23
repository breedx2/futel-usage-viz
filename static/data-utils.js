
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
  const result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  events.forEach(event => {
    result[event.hour]++;
  })
  return result;
}

function filterEvents(data, eventName){
  if(!eventName) return data;
  return data.filter(x => x.event === eventName);
}
