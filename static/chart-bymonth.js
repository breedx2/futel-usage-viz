
var rawByMonthJsonData = null;

function byMonthSelectionChanged(event){
  const sel = document.getElementById("bymonthsel");
  const eventNames = [...sel.selectedOptions].map(x => x.label);
  drawByMonthChart(eventNames);
}

function fetchByMonthData(event){
  if(rawByMonthJsonData){
    return Promise.resolve(rawByMonthJsonData);
  }
  console.log("Fetching by month data from remote...");
  return fetch('./data/eventsPerMonth.json')
    .then(response => response.json())
    .then(data => {
      rawByMonthJsonData = data;
      return data;
    });
}

function drawByMonthChart(eventNamesToShow = ['all']) {
  fetchByMonthData()
    .then(data => {

    // TODO: Filter out incoming
    const rawDatasets = buildMonthDatasets(data);
    const datasets = rawDatasets.filter(x => {
      return eventNamesToShow.includes('all') || eventNamesToShow.includes(x.label);
    });
    const monthLabels = Object.keys(data);

    if(charts.byMonthChart){
      charts.byMonthChart.clear();
      charts.byMonthChart.data.datasets = datasets;
      charts.byMonthChart.update();
      return;
    }
    const ctx = document.getElementById('bymonthcnv').getContext('2d');
    charts.byMonthChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthLabels,
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
  });
}

function buildMonthDatasets(data){

  const allNamesDuped = Object.entries(data).flatMap(e => Object.keys(e[1]));
  const allNames = [...allNamesDuped.reduce( (acc,val) => {
    acc.add(val);
    return acc;
  }, new Set())].sort()

  // each event is a series
  return allNames.map(eventName => {
    const series = Object.entries(data).map(e => e[1][eventName] || 0);
    return {
      label: eventName,
      borderColor: stringToColor(eventName),
      data: series
    }
  });
}
