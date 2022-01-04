
var rawByMonthJsonData = null;

function byMonthSelectionChanged(event){
  console.log('event selection changed');
  grabStateAndDrawByMonth();
}

function byMonthYearChanged(event){
  console.log('by month year changed');
  grabStateAndDrawByMonth();
}

function grabStateAndDrawByMonth(){
  const eventSel = document.getElementById("bymonthsel");
  const eventNames = [...eventSel.selectedOptions].map(x => x.label);

  const yearSel = document.getElementById("bymonthyearsel");
  const years = [...yearSel.selectedOptions].map(x => x.label);

  drawByMonthChart(eventNames.length ? eventNames : ['operator'], years);
}

async function fetchByMonthData(event){
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
    const option = document.createElement('option');
    option.text = name;
    sel.add(option);
  });
}

async function drawByMonthChart(eventNamesToShow = ['operator'], yearsToShow = ['all']) {
  const data = await fetchByMonthData();
  const filteredEntries = Object.entries(data).filter(e => {
    return yearsToShow.includes('all') ||
      yearsToShow.includes(e[0].replace(/-\d\d/, ''));
  });
  const yearFilteredData = Object.fromEntries(filteredEntries);

  // TODO: Filter out incoming calls

  const rawDatasets = buildMonthDatasets(yearFilteredData);
  const datasets = rawDatasets.filter(x => {
    return eventNamesToShow.includes('all') || eventNamesToShow.includes(x.label);
  });
  const monthLabels = buildContinuousMonthRangeFromData(yearFilteredData);

  if(charts.byMonthChart){
    charts.byMonthChart.clear();
    charts.byMonthChart.data.datasets = datasets;
    charts.byMonthChart.data.labels = monthLabels;
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
        animation: {
          duration: 333
        }
      }
  });
}

function buildMonthDatasets(data){

  const allNames = allEventNames(data);
  const allMonthKeys = buildContinuousMonthRangeFromData(data);

  // each event is a series
  return allNames.map(eventName => {

    const series = allMonthKeys.map(month => {
      if(!data[month]) return 0;
      return data[month][eventName] || 0;
    });
    return {
      label: eventName,
      borderColor: stringToColor(eventName),
      data: series
    }
  });
}

function buildContinuousMonthRangeFromData(data){
  const allDates = Object.keys(data);
  allDates.sort();
  const first = allDates[0];
  const last = allDates.slice(-1)[0];
  return buildContinuousMonthRange(first, last);
}
