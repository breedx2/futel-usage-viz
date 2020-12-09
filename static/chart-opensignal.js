function drawAllOpenSignal() {
  fetch('./data/openSignal.json')
    .then(response => response.json())
    .then(data => {
      const monthData = rollupOpenSignalToMonths(data);
      drawOpenSignalHandsetMenu(monthData);
      drawOpenSignalRemoteMenu(monthData);
      drawOpenSignalContent(monthData);
    });
}

function drawOpenSignalHandsetMenu(data) {
  drawOpenSignalMenu({
    data: data.handsetPickups,
    chartId: 'os-handset-menu',
    label: 'OpenSignal handset pickups',
    color: stringToColor("OpenSignal handset pickups."),
    globalChartNameRef: 'opensignalHandsetMenuChart'
  });
}

function drawOpenSignalRemoteMenu(data) {
  drawOpenSignalMenu({
    data: data.remoteMenu,
    chartId: 'os-remote-menu',
    label: 'OpenSignal remote menu',
    color: stringToColor("OpenSignal remote menu.."),
    globalChartNameRef: 'opensignalRemoteMenuChart'
  });
}

function drawOpenSignalMenu(opts) {
  const series = openSignalMonthRangeFromObj(opts.data);
  const labels = Object.keys(series);
  const data = Object.values(series);

  const ctx = document.getElementById(opts.chartId).getContext('2d');
  charts[opts.globalChartNameRef] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: opts.label,
        borderColor: opts.color,
        data: data,
      }],
    },
    options: {
      responsive: true
    }
  });
}

function openSignalBlend(obj1, obj2){
  const result = Object.fromEntries(Object.entries(obj1));
  return Object.entries(obj2).reduce((acc,e) => {
    acc[e[0]] = e[1] + (acc[e[0]]);
    return acc;
  }, result);
}

function drawOpenSignalContent(data){
  const combined = {
    peoplesHomesData: openSignalBlend(data.handsetContent.peoples_homes, data.remoteContent.peoples_homes),
    conversationsData: openSignalBlend(data.handsetContent.conversations, data.remoteContent.conversations),
    missedConnData: openSignalBlend(data.handsetContent.missed_connections, data.remoteContent.missed_connections)
  }

  const datasets = [
    {
      label: "People's Homes",
      borderColor: stringToColor("peoples homes"),
      data: Object.values(combined.peoplesHomesData),
    },
    {
      label: "Conversations",
      borderColor: stringToColor(".conversations..."),
      data: Object.values(combined.conversationsData),
    },
    {
      label: "Missed Connections",
      borderColor: stringToColor(".missed connections"),
      data: Object.values(combined.missedConnData),
    }
  ];
  const labels = Object.keys(combined.peoplesHomesData);
  const ctx = document.getElementById('os-content').getContext('2d');
  charts.opensignalContent = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true
    }
  });
}

function rollupOpenSignalToMonths(data){
  const allMonths = openSignalMonthRange(data);

  return {
    handsetPickups: rollupMonths(allMonths, data.handsetPickups),
    remoteMenu: rollupMonths(allMonths, data.remoteMenu),
    handsetContent: Object.fromEntries(
      Object.entries(data.handsetContent).map(e => [e[0], rollupMonths(allMonths, e[1])])
    ),
    remoteContent: Object.fromEntries(
      Object.entries(data.remoteContent).map(e => [e[0], rollupMonths(allMonths, e[1])])
    ),
  };
}

function openSignalMonthRange(data){
  const months = new Set();
  addUniqueMonths(data.handsetPickups, months);
  addUniqueMonths(data.remoteMenu, months);
  Object.values(data.handsetContent).forEach(obj => addUniqueMonths(obj, months));
  Object.values(data.remoteContent).forEach(obj => addUniqueMonths(obj, months));
  return openSignalMonthRangeFromSet(months);
}

function openSignalMonthRangeFromObj(obj){
  const months = new Set();
  Object.keys(obj).forEach(m => months.add(m));
  return rollupMonths(openSignalMonthRangeFromSet(months), obj, x=>x);
}

function openSignalMonthRangeFromSet(months){
  const sorted = [...months].sort();
  const first = sorted[0];
  const last = sorted.slice(-1)[0];
  return buildContinuousMonthRange(first, last);
}

function addUniqueMonths(obj, set){
  Object.keys(obj).map(d => d.replace(/-\d\d$/, '')).forEach(d => set.add(d));
}

function rollupMonths(allMonths, obj, dateToMonth = d => d.replace(/-\d\d$/, '')){
  return Object.entries(obj).reduce((acc,e) => {
    const month = dateToMonth(e[0]);
    acc[month] += e[1];
    return acc;
  }, Object.fromEntries(allMonths.map(m => [m,0])));
}

function dateRangeMultiSeries(data) {
  const all = Object.values(data);
  const allBounds = all.flatMap(series => {
    const sorted = Object.keys(series).sort();
    return [sorted[0], sorted.slice(-1)[0]];
  });
  const sorted = allBounds.sort();
  return [new Date(sorted[0]), new Date(sorted.slice(-1)[0])];
}
