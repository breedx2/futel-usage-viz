
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
  document.getElementById("byhoursel")
    .addEventListener('change', byHourSelectionChanged);
  document.getElementById('bydatesel')
    .addEventListener('change', byDateSelectionChanged);
  document.getElementById('byhourstacked').addEventListener('change', () => {
    if(charts.byHourChart){
      charts.byHourChart.destroy();
      charts.byHourChart = null;
    }
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
