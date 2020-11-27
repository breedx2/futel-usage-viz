
function drawAllOpenSignal(){
  fetch('./data/openSignal.json')
    .then(response => response.json())
    .then(data => {
      drawOpenSignalHandsetMenu(data);
      drawOpenSignalRemoteMenu(data);
    });
}

function drawOpenSignalHandsetMenu(data){
  const pickups = buildDateSeries(data.handsetPickups);
  const handsetPickupData = Object.entries(pickups)
    .map(entry => entry[1]);
  const labels = Object.entries(pickups)
      .map(entry => entry[0]);

  const ctx = document.getElementById('os-handset-menu').getContext('2d');
  charts.opensignalHandsetMenuChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'OpenSignal handset pickups',
          borderColor: stringToColor("OpenSignal handset pickups."),
          data: handsetPickupData,
        }],
      },
      options: {
        responsive: true
      }
  });
}

function drawOpenSignalRemoteMenu(data){
  const remotes = buildDateSeries(data.remoteMenu);
  const remoteMenuData = Object.entries(remotes)
    .map(entry => entry[1]);
  const labels = Object.entries(remotes)
      .map(entry => entry[0]);

  const ctx = document.getElementById('os-remote-menu').getContext('2d');
  charts.opensignalHandsetMenuChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'OpenSignal remote menu',
          borderColor: stringToColor("OpenSignal remote menu.."),
          data: remoteMenuData,
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
