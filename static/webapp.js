
const charts = {};

updateHandlers();
drawAllOpenSignal();
drawByHourChart();
drawByDateChart();
drawByMonthChart();
drawYearSummary();
drawByFoneChart();

function updateHandlers(){
  document.getElementById("byhoursel")
    .addEventListener('change', byHourSelectionChanged);
  document.getElementById('bydatesel')
    .addEventListener('change', byDateSelectionChanged);
  document.getElementById('bymonthsel')
    .addEventListener('change', byMonthSelectionChanged);
  document.getElementById('bymonthyearsel')
    .addEventListener('change', byMonthYearChanged);
  document.getElementById('bydateyearsel')
    .addEventListener('change', byDateYearChanged);
  document.getElementById('byfonesel')
      .addEventListener('change', byFoneEventSelectionChanged);
  document.getElementById('byfoneyearsel')
    .addEventListener('change', byFoneYearChanged);
  document.getElementById('byhourstacked').addEventListener('change', () => {
    if(charts.byHourChart){
      charts.byHourChart.destroy();
      charts.byHourChart = null;
    }
    byHourSelectionChanged();
  });
}
