
const charts = {};

loadData()
  .then(data => {
    console.log(data);
    const holder = document.querySelector("data");
    holder.data = data;
    updateHandlers();
    addSelectableEvents(data);
    drawByHourChart(data);
    drawByDateChart(data);
    drawYearSummary(data);
  });

function updateHandlers(){
  const sel = document.getElementById("byhoursel");
  sel.addEventListener('change', byHourSelectionChanged);
  document.getElementById('byhourstacked').addEventListener('change', () => {
    byHourSelectionChanged();
  });
}

function addSelectableEvents(data){
  const names = eventNames(data);
  ['byhoursel', 'bydatesel'].forEach(selName => {
    const sel = document.getElementById(selName);
    names.forEach(name => {
      var option = document.createElement('option');
      option.text = name;
      sel.add(option);
    });
  });
}

function byHourSelectionChanged(event){
  const sel = document.getElementById("byhoursel");
  const holder = document.querySelector("data");
  drawByHourChart(holder.data, sel.value);
}

function drawByDateChart(data, eventType) {
  const filtered = omitIncoming(filterEvents(data, eventType === 'all' ? null : eventType));

  const datasets = buildDateDatasets(filtered);
  console.log(datasets);
  const dateLabels = getOrderedDates(filtered);
  // console.log(dateLabels);

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
  console.log(eventToDateCount);

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
