
function byHourSelectionChanged(event){
  const sel = document.getElementById("byhoursel");
  const holder = document.querySelector("data");
  drawByHourChart(holder.data, sel.value);
}

function drawByHourChart(data, eventType) {
  const filtered = omitIncoming(filterEvents(data, eventType === 'all' ? null : eventType));
  const isStacked = document.querySelector('#byhourstacked').checked;

  const datasets = buildHourlyDatasets(filtered, isStacked);

  if(charts.byHourChart){
    charts.byHourChart.clear();
    charts.byHourChart.data.datasets = datasets;
    charts.byHourChart.update();
    return;
  }
  const ctx = document.getElementById('byhourcnv').getContext('2d');
  charts.byHourChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...Array(24).keys()],
        datasets: datasets
      },
      options: {
        layout: {
          padding: { left: 100, right: 100}
        },
        scales: {
          y: {
            stacked: isStacked
          }
        },
        legend: {
            position: 'bottom',
            display: isStacked
         },
      }
  });
}

function buildHourlyDatasets(data, isStacked){
  if(isStacked){
    const setsByEvent = data.reduce((acc,event) => {
      if(!acc[event.event]){
        acc[event.event] = emptyHourlyArray();
      }
      acc[event.event][event.hour]++;
      return acc;
    }, {});
    return Object.keys(setsByEvent).map(eventName =>
      ({
        stack: 'stack0',
        label: eventName,
        backgroundColor: stringToColor(eventName),
        borderColor: 'black',
        borderWidth: 1,
        data: setsByEvent[eventName]
      })
    );
  }
  const hourly = byHour(data);
  return [{
    label: 'events per hour',
    backgroundColor: '#d8dde6',
    borderColor: 'black',
    borderWidth: 1,
    data: hourly
  }];
}
