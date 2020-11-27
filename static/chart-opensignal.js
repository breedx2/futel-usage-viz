
function drawAllOpenSignal(){
  fetch('./data/openSignal.json')
    .then(response => response.json())
    .then(data => {
      drawOpenSignalHandsetMenu(data);
      drawOpenSignalRemoteMenu(data);
    });
}

function drawOpenSignalHandsetMenu(data){
  drawMenu({
    data: data.handsetPickups,
    chartId: 'os-handset-menu',
    label: 'OpenSignal handset pickups',
    color: stringToColor("OpenSignal handset pickups.")
  });
}

function drawOpenSignalRemoteMenu(data){
  drawMenu({
    data: data.remoteMenu,
    chartId: 'os-remote-menu',
    label: 'OpenSignal remote menu',
    color: stringToColor("OpenSignal remote menu..")
  });
}

function drawMenu(opts){
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


// ensures the data has consistent date range (no date gaps)
function buildDateSeries(data){
  const first = new Date(Object.entries(data)[0][0]);
  const last = new Date(Object.entries(data).slice(-1)[0][0]);
  console.log(`${first} and ${last}`)
  const d = new Date(first);
  const result = [];
  while(d <= last){
    result.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  const entries = result.map(d => [d, data[d] || 0]);
  return Object.fromEntries(entries);
}
