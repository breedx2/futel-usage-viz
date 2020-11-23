

// add all the files here or cat into one giant one or monthly or something.
const SOURCES = [
  'metrics-20201030',
  'metrics-20201031'
];

function loadData(){
  const promises = SOURCES.map(source =>
    fetch(`/${source}`)
      .then(response => response.text())
      .then(body => parseLines(body))
  );
  return Promise.all(promises)
    .then(results => results.flatMap(x => x));
}

function parseLines(lines){
  return lines.split('\n')
    .filter(line => line) //remove empty
    .map(parseLine);
}

function parseLine(line){
  const re = /(\d\d\d\d-\d\d-\d\d) (\d\d):.* CALLERID\(number\)=\+?\d+, UNIQUEID=(.*), CHANNEL=(.*), name=(.*)/;
  const [x, date, hour, uid, channel, event] = line.match(re);
  const [xx, timestamp] = line.match(/^(.*) CALLERID.*/);
  return {
    timestamp: timestamp,
    date: date,
    hour: parseInt(hour),
    uid: uid,
    channel: channel,
    event: event
  }
}
