'use strict';

class LineParser {

  parse(line) {
    const re = /(\d\d\d\d-\d\d-\d\d) (\d\d):.* CALLERID\(number\)=\+?\w*, UNIQUEID=(.*), CHANNEL=(.*), name=(.*)/;
    const [x, date, hour, uid, channel, name] = line.match(re);
    const [xx, timestamp] = line.match(/^(.*) CALLERID.*/);
    return {
      timestamp: timestamp,
      date: date,
      hour: parseInt(hour),
      uid: uid,
      channel: channel,
      name: name
    }
  }
}

export default LineParser;
