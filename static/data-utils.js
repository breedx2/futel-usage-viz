
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

//TODO: deprecated/old data format
function eventNames(data){
  return [...data.reduce( (acc,val) => {
    acc.add(val.event);
    return acc;
  }, new Set())].sort();
}

// for data sources who look like { date: { event: count}, date: { event: count}, ...}
function allEventNames(data){
  const allNamesDuped = Object.entries(data).flatMap(e => Object.keys(e[1]));
  return [...allNamesDuped.reduce( (acc,val) => {
    acc.add(val);
    return acc;
  }, new Set())].sort();
}


function byHour(events){filterEvents
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

//TODO: Deprecated / old format raw data
function filterEvents(data, eventName){
  if(!eventName) return data;
  return data.filter(x => x.event === eventName);
}

//TODO: Deprecated / old format raw data
function filterEventsByNames(data, eventNames){
  if(eventNames.includes('all')) return data;
  return data.filter(x => eventNames.includes(x.event));
}

function getOrderedDates(data){
  return [...data.reduce((acc,event) => {
    acc.add(event.date);
    return acc;
  }, new Set())].sort();
}

function formatDate(d){
  const yyyy = '' + d.getFullYear();
  var mm = '' + (d.getMonth()+1);
  if(mm.length < 2){
    mm = '0' + mm;
  }
  var dd = '' + d.getDate();
  if(dd.length < 2){
    dd = '0' + dd;
  }
  return `${yyyy}-${mm}-${dd}`;
}
