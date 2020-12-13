'use strict';

class LineParser {

  parse(line) {
    const re = /(\d\d\d\d-\d\d-\d\d) (\d\d):.* CALLERID\(number\)=\+?\w*, UNIQUEID=(.*), CHANNEL=(.*), name=(.*)/;
    const [x, date, hour, uid, channel, name] = line.match(re);
    const [xx, timestamp] = line.match(/^(.*) CALLERID.*/);
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
