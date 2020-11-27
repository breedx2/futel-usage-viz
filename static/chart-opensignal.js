function drawAllOpenSignal() {
  fetch('./data/openSignal.json')
    .then(response => response.json())
    .then(data => {
      drawOpenSignalHandsetMenu(data);
      drawOpenSignalRemoteMenu(data);
      drawOpenSignalHandsetContent(data);
    });
}

function drawOpenSignalHandsetMenu(data) {
  drawOpenSignalMenu({
    data: data.handsetPickups,
    chartId: 'os-handset-menu',
    label: 'OpenSignal handset pickups',
    color: stringToColor("OpenSignal handset pickups.")
  });
}

function drawOpenSignalRemoteMenu(data) {
  drawOpenSignalMenu({
    data: data.remoteMenu,
    chartId: 'os-remote-menu',
    label: 'OpenSignal remote menu',
    color: stringToColor("OpenSignal remote menu..")
  });
}

function drawOpenSignalMenu(opts) {
  const series = buildDateSeries(opts.data);
  const labels = Object.keys(series);
  const data = Object.values(series);

  const ctx = document.getElementById(opts.chartId).getContext('2d');
  charts.opensignalHandsetMenuChart = new Chart(ctx, {
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

function drawOpenSignalHandsetContent(data) {
  const opts = {
    chartId: 'os-handset-content'
  }
  const [start, end] = dateRangeMultiSeries(data.handsetContent);
  const peoplesHomesData = buildDateSeriesRange(data.handsetContent.peoples_homes, start, end);
  const conversationsData = buildDateSeriesRange(data.handsetContent.conversations, start, end);
  const missedConnData = buildDateSeriesRange(data.handsetContent.missed_connections, start, end);

  const datasets = [
    {
      label: "People's Homes",
      borderColor: stringToColor("peoples homes"),
      data: Object.values(peoplesHomesData),
    },
    {
      label: "Conversations",
      borderColor: stringToColor(".conversations..."),
      data: Object.values(conversationsData),
    },
    {
      label: "Missed Connections",
      borderColor: stringToColor(".missed connections"),
      data: Object.values(missedConnData),
    }
  ];

  const labels = Object.keys(peoplesHomesData);
  const ctx = document.getElementById(opts.chartId).getContext('2d');
  charts.opensignalHandsetMenuChart = new Chart(ctx, {
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

function dateRangeMultiSeries(data) {
  const all = Object.values(data);
  const allBounds = all.flatMap(series => {
    const sorted = Object.keys(series).sort();
    return [sorted[0], sorted.slice(-1)[0]];
  });
  const sorted = allBounds.sort();
  return [new Date(sorted[0]), new Date(sorted.slice(-1)[0])];
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
