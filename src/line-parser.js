'use strict';

class LineParser {

  parse(line) {
    const [x, timestamp, fieldParts] = line.match(/^(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d[,.]\d\d\d) (.*)/);
    const [xx, date, hour] = line.match(/^(\d\d\d\d-\d\d-\d\d) (\d\d).*/);

    const fieldObj = Object.fromEntries(fieldParts.split(/, ?/).map(x => x.split(/=/)));
    const channel = fieldObj['CHANNEL'];
    const uid = fieldObj['UNIQUEID'];
    const name = fieldObj['name'];

    const [xxx, extension] = channel.match(/(SIP.*)-.*/);
    return {
      timestamp: timestamp,
      date: date,
      hour: parseInt(hour),
      uid: uid,
      channel: channel,
      extension: extension,
      name: name
    }
  }
}

export default LineParser;
