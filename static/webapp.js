
const charts = {};

loadData()
  .then(data => {
    console.log(data);
    const holder = document.querySelector("data");
    holder.data = data;
    updateHandlers();
    updateSelectionEvents(data);
    drawByHourChart(data);
    drawYearSummary(data);
  });

function updateHandlers(){
  const sel = document.getElementById("byhoursel");
  sel.addEventListener('change', selectionChanged);
  document.getElementById('byhourstacked').addEventListener('change', () => {
    selectionChanged();
  });
}

function updateSelectionEvents(data){
  const names = eventNames(data);
  const sel = document.getElementById("byhoursel");
  names.forEach(name => {
    var option = document.createElement("option");
    option.text = name;
    sel.add(option);
  });
}

function selectionChanged(event){
  const sel = document.getElementById("byhoursel");
  const holder = document.querySelector("data");
  drawByHourChart(holder.data, sel.value);
}

function drawByHourChart(data, eventType) {
  const filtered = filterEvents(data, eventType === 'all' ? null : eventType);
  const isStacked = document.querySelector('#byhourstacked').checked;

  const datasets = buildHourlyDatasets(omitIncoming(filtered), isStacked);

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

function drawYearSummary(data){
  const summary = yearSummary(data);
  const years = Object.keys(summary);
  const tot = document.querySelector('#yeartotals');
  years.forEach(year => {
    tot.insertAdjacentHTML('beforeend', `<h3>${year}</h3>`);
    const yearData = summary[year];
    const events = Object.keys(yearData);
    const lineItems = events.reduce( (acc, event) => {
      const total = yearData[event];
      const li = `<li>${event}: <b>${total}</b></li>`;
      return acc + li;
    }, "")
    tot.insertAdjacentHTML('beforeend', `<ul>${lineItems}</ul>`);

  });
}
