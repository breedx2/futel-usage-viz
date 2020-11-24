
function byDateSelectionChanged(event){
  const sel = document.getElementById("bydatesel");
  const holder = document.querySelector("data");
  drawByDateChart(holder.data, sel.value);
}

function drawByDateChart(data, eventType) {
  const filtered = omitIncoming(filterEvents(data, eventType === 'all' ? null : eventType));

  const datasets = buildDateDatasets(filtered);
  const dateLabels = getOrderedDates(filtered);

  if(charts.byDateChart){
    charts.byDateChart.clear();
    charts.byDateChart.data.datasets = datasets;
    charts.byDateChart.update();
    return;
  }
  const ctx = document.getElementById('bydatecnv').getContext('2d');
  charts.byDateChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: datasets
      },
      options: {
        layout: {
          padding: { left: 100, right: 100}
        },
        legend: {
            position: 'bottom',
            display: true
         },
      }
  });
}

function buildDateDatasets(data){
  const allEventNames = eventNames(data);
  const eventToDateCount = data.reduce((acc,event) => {
    if(!acc[event.event]){
      acc[event.event] = {};
    }
    if(!acc[event.event][event.date]){
      acc[event.event][event.date] = 0;
    }
    acc[event.event][event.date]++;
    return acc;
  }, {});

  // each event is a series
  return allEventNames.map(event => {
    const dates = getOrderedDates(data);
    const series = dates.map(date => eventToDateCount[event][date] || 0);
    return {
      label: event,
      borderColor: stringToColor(event),
      data: series
    }
  });
}
