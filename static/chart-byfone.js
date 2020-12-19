let rawByFoneJsonData = null;
let extensions = null;

function byFoneYearChanged(event) {
  console.log('by fone year changed');
  grabStateAndDrawByFone();
}

function byFoneEventSelectionChanged(event) {
  console.log('by fone events changed');
  grabStateAndDrawByFone();
}

function grabStateAndDrawByFone() {
  const eventSel = document.getElementById("byfonesel");
  const events = [...eventSel.selectedOptions].map(x => x.label);

  const yearSel = document.getElementById("byfoneyearsel");
  const years = [...yearSel.selectedOptions].map(x => x.label);

  drawByFoneChart(events, years);
}

function setByFoneSelectableEvents(data) {
  const sel = document.getElementById('byfonesel');
  const names = [...new Set(Object.values(data)
    .flatMap(Object.values)
    .flatMap(Object.keys))].sort();
  names.forEach(name => {
    const option = document.createElement('option');
    option.text = name;
    if (name === 'operator') {
      option.selected = true;
    }
    sel.add(option);
  });
}

async function fetchByFoneData(event) {
  if (rawByFoneJsonData) {
    return Promise.resolve(rawByFoneJsonData);
  }
  console.log("Fetching per-fone data from remote...");
  return fetch('./data/eventsPerFone.json')
    .then(response => response.json())
    .then(data => {
      setByFoneSelectableEvents(data);
      rawByFoneJsonData = data;
      return data;
    });
}

async function fetchExtensionData(event) {
  if (extensions) {
    return Promise.resolve(extensions);
  }
  console.log("Fetching pretty extension names...");
  return fetch('./data/extensions.json')
    .then(response => response.json())
    .then(data => {
      extensions = data;
      return data;
    });
}

async function drawByFoneChart(eventNamesToShow = ['operator'], yearsToShow = ['all']) {
  const data = await fetchByFoneData();
  const filtered = filterFonesToSelection(filterByFone(data), eventNamesToShow, yearsToShow);
  const rollups = rollUpByFone(filtered);
  const pretty = await mapExtensionNames(rollups);

  const datasets = [{
    data: Object.values(pretty),
    backgroundColor: Object.keys(pretty).map(stringToColor)
  }];
  const labels = Object.keys(pretty);

  if (charts.byFoneChart) {
    charts.byFoneChart.clear();
    charts.byFoneChart.data.datasets = datasets;
    charts.byFoneChart.data.labels = labels;
    charts.byFoneChart.update();
    return;
  }
  const ctx = document.getElementById('byfonecnv').getContext('2d');
  charts.byFoneChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      title: {
        text: 'Events By Fone',
        display: 'true'
      },
      layout: {
        padding: {
          left: 100,
          right: 100
        }
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

async function mapExtensionNames(data) {
  const map = await fetchExtensionData();
  return Object.fromEntries(
    Object.entries(data).map(e => {
      const sip = e[0];
      const k = sip.replace(/^SIP\//, '');
      const extension = map[k] || sip;
      return [extension, e[1]];
    })
  );
}

function rollUpByFone(data) {
  const fones = allFones(data);
  const result = Object.fromEntries(fones.map(f => [f, 0]));
  Object.values(data).forEach(obj => {
    Object.entries(obj).forEach(entry => {
      const fone = entry[0];
      Object.values(entry[1]).forEach(v => result[fone] += v);
    });
  });
  return result;
}

function allFones(data) {
  return [...new Set(Object.entries(data)
      .map(e => e[1])
      .flatMap(obj => Object.keys(obj)))]
    .sort();
}

// let's just look at the 3-digit extensions in the UI
function filterByFone(data) {
  const newMonths = Object.entries(data)
    .map(entry => {
      const filtered = Object.fromEntries(
        Object.entries(entry[1])
        .filter(entry => entry[0].match(/^SIP\/\d\d\d$/))
      );
      return [entry[0], filtered];
    });
  return Object.fromEntries(newMonths);
}

function filterFonesToSelection(data, eventNamesToShow, yearsToShow) {
  const filteredEntries = Object.entries(data)
    .filter(e => {
      return yearsToShow.includes('all') ||
        yearsToShow.includes(e[0].replace(/-\d\d$/, ''));
    })
    .map(e => {
      const date = e[0];
      const phoneToEvents = e[1];
      const objE = Object.entries(phoneToEvents)
        .map(e => {
          const phone = e[0];
          const filteredEvents = Object.fromEntries(
            Object.entries(e[1]).filter(ee =>
              eventNamesToShow.includes('all') || eventNamesToShow.includes(ee[0])
            )
          );
          return [phone, filteredEvents];
        })
        .filter(e => Object.keys(e[1]).length > 0);
      return [e[0], Object.fromEntries(objE)];
    });
  return Object.fromEntries(filteredEntries);
}
