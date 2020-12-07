
var rawByHourJsonData = null;

function byHourSelectionChanged(event){
  console.log('By hour event selection changed.');
  const sel = document.getElementById("byhoursel");
  const holder = document.querySelector("data");
  drawByHourChart([sel.value]);
}

async function fetchByHourData(){
  if(rawByHourJsonData){
    return Promise.resolve(rawByHourJsonData);
  }
  console.log("Fetching by hour data from remote...");
  return fetch('./data/eventsPerHourOfDay.json')
    .then(response => response.json())
    .then(data => {
      //TODO: Add events to selection
      rawByHourJsonData = data;
      return rawByHourJsonData;
    });
}

async function drawByHourChart(eventNamesToInclude = ['all']) {
  const rawData = await fetchByHourData();

  //TODO: Omit incoming or maybe omit it in the preprocessing?

  const isStacked = document.querySelector('#byhourstacked').checked;

  const datasets = buildHourlyDatasets(rawData, eventNamesToInclude, isStacked);

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

function buildHourlyDatasets(data, eventNamesToInclude, isStacked){
  if(isStacked){
    const eventNames = allEventNames(data);
    return eventNames.map(eventName => {

      const dataSet = emptyHourlyArray().map((v,i) => data[i][eventName] || 0);

      return {
        stack: 'stack0',
        label: eventName,
        backgroundColor: stringToColor(eventName),
        borderColor: 'black',
        borderWidth: 1,
        data: dataSet
      };
    });
  }
  const hourly = Object.entries(data).reduce((acc,entry) => {
    const month = entry[0];
    const sum = Object.entries(entry[1])
        .filter(e => eventNamesToInclude.includes('all') || eventNamesToInclude.includes(e[0]))
        .map(e => e[1])
        .reduce((acc,count) => acc + count, 0);
    acc[month] = sum;
    return acc;
  }, emptyHourlyArray());
  return [{
    label: 'events per hour',
    backgroundColor: '#d8dde6',
    borderColor: 'black',
    borderWidth: 1,
    data: hourly
  }];
}
