
var rawByDateJsonData = null;

function byDateSelectionChanged(event){
  console.log('by date event selection changed');
  grabStateAndDrawByDate();
}

function byDateYearChanged(event){
  console.log('by date year changed');
  grabStateAndDrawByDate();
}

function grabStateAndDrawByDate(){
  const eventSel = document.getElementById("bydatesel");
  const eventNames = [...eventSel.selectedOptions].map(x => x.label);

  const yearSel = document.getElementById("bydateyearsel");
  const years = [...yearSel.selectedOptions].map(x => x.label);

  drawByDateChart(eventNames.length ? eventNames : ['all'], years);
}

async function fetchByDateData(event){
  if(rawByDateJsonData){
    return Promise.resolve(rawByDateJsonData);
  }
  console.log("Fetching by date data from remote...");
  return fetch('./data/eventsPerDate.json')
    .then(response => response.json())
    .then(data => {
      setByDateSelectable(data);
      rawByDateJsonData = data;
      return data;
    });
}

function setByDateSelectable(data){
  const sel = document.getElementById('bydatesel');
  const names = allEventNames(data);
  names.forEach(name => {
    const option = document.createElement('option');
    option.text = name;
    if(name == 'operator') {
      option.selected = 'true';
    }
    sel.add(option);
  });
}

async function drawByDateChart(eventTypes = ['operator'], yearsToShow = ['all']) {
  const data = await fetchByDateData();
  //TODO: Omit incoming data (or maybe it's omitted in source?)

  const filteredEntries = Object.entries(data).filter(e => {
    return yearsToShow.includes('all') ||
      yearsToShow.includes(e[0].replace(/-\d\d-\d\d/, ''));
  });
  const yearFilteredData = Object.fromEntries(filteredEntries);

  const rawDatasets = buildDateDatasets(yearFilteredData);

  const datasets = rawDatasets.filter(x => {
    return eventTypes.includes('all') || eventTypes.includes(x.label);
  });
  const dateLabels = buildContinuousRangeFromDateKeyed(yearFilteredData);

  if(charts.byDateChart){
    charts.byDateChart.clear();
    charts.byDateChart.data.datasets = datasets;
    charts.byDateChart.data.labels = dateLabels;
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
        animation: {
          duration: 333
        }
      }
  });
}

function buildDateDatasets(data){

  const allNames = allEventNames(data);
  const allDates = buildContinuousRangeFromDateKeyed(data);

  // each event is a series
  return allNames.map(eventName => {
    const series = allDates.map(date => {
      if(!data[date]) return 0;
      return data[date][eventName] || 0;
    });
    return {
      label: eventName,
      borderColor: stringToColor(eventName),
      borderWidth: 1,
      data: series
    };
  });
}

//Ensure a continuous timeline, even when there are gaps in dates!
function buildContinuousRangeFromDateKeyed(data){
  const firstDate = new Date(Object.keys(data)[0]);
  const lastDate = new Date(Object.keys(data).slice(-1)[0]);
  return buildDateRange(firstDate, lastDate);
}
