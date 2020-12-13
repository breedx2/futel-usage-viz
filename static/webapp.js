
const charts = {};

    // console.log("TODO WIP GET RID OF ME!");
    // console.log(data);
    // const holder = document.querySelector("data");
    // holder.data = data;
updateHandlers();
drawAllOpenSignal();
drawByHourChart();
drawByDateChart();
drawByMonthChart();
drawYearSummary();

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
  document.getElementById('byhourstacked').addEventListener('change', () => {
    if(charts.byHourChart){
      charts.byHourChart.destroy();
      charts.byHourChart = null;
    }
    byHourSelectionChanged();
  });
}
