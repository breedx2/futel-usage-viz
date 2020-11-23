
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

}

function byHour(events){
  const result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  events.forEach(event => {
    result[event.hour]++;
  })
  return result;
}
