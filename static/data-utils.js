
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

function emptyHourlyArray(){
  return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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

//TODO: Deprecated / old format raw data
function getOrderedDates(data){
  return [...data.reduce((acc,event) => {
    acc.add(event.date);
    return acc;
  }, new Set())].sort();
}

// ensures the data has consistent date range (no date gaps)
function buildDateSeries(data) {
  const first = new Date(Object.keys(data)[0]);
  const last = new Date(Object.keys(data).slice(-1)[0]);
  return buildDateSeriesRange(data, first, last);
}

function buildDateSeriesRange(data, first, last) {
  const d = new Date(first);
  const result = [];
  while (d <= last) {
    result.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  const entries = result.map(d => [d, data[d] || 0]);
  return Object.fromEntries(entries);
}

function buildDateRange(first, last){
  const d = new Date(first);
  const result = [];
  while (d <= last) {
    result.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
}

function buildContinuousMonthRange(first, last){
  const [y,m] = first.split(/-/);
  var [year,month] = [parseInt(y), parseInt(m)];
  var date = `${year}-${pad2(month)}`;
  const result = [];
  do {
    result.push(date);
    month++;
    if(month > 12){
      month = 1;
      year++;
    }
    date = `${year}-${pad2(month)}`;
  } while(date !== last)
  result.push(last);
  return result;
}

function formatDate(d){
  const yyyy = '' + d.getFullYear();
  var mm = pad2(d.getMonth()+1);
  var dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function pad2(value){
  var result = '' + value;
  if(result.length < 2){
    return '0' + result;
  }
  return result;
}
