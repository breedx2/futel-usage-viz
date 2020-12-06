
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
      setMonthSelectable(data);
      rawByMonthJsonData = data;
      return data;
    });
}

function setMonthSelectable(data){
  const sel = document.getElementById('bymonthsel');
  const names = allEventNames(data);
  names.forEach(name => {
    var option = document.createElement('option');
    option.text = name;
    sel.add(option);
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
          title: {
          text: 'Events By Month',
          display: 'true'
          },
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

  const allNames = allEventNames(data);

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
