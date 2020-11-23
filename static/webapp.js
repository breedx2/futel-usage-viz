
const charts = {};

loadData()
  .then(data => {
    console.log(data);
    const holder = document.querySelector("data");
    holder.data = data;
    updateSelection(data);
    drawByHourChart(data);
  });

function updateSelection(data){
  const names = eventNames(data);
  const sel = document.getElementById("byhoursel");
  sel.addEventListener('change', selectionChanged);
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
  const filtered = filterEvents(data, eventType);
  const hourly = byHour(omitIncoming(filtered));
  console.log(hourly);

  const dataset = {
    label: 'events per hour',
    backgroundColor: '#d8dde6',
    borderColor: 'black',
    borderWidth: 1,
    data: hourly
  };

  if(charts.byHourChart){
    charts.byHourChart.clear();
    charts.byHourChart.data.datasets[0] = dataset;
    charts.byHourChart.update();
    return;
  }

  const ctx = document.getElementById('byhour').getContext('2d');
  charts.byHourChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...Array(24).keys()],
        datasets: [dataset]
      },
      options: {
        layout: {
          padding: { left: 100, right: 100}
        }
      }
  });
}

function addEvents(selId) {

}
