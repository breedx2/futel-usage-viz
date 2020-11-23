console.log('hello world');

loadData()
  .then(data => {
    console.log(data);
    drawByHour(data);
  });

function drawByHour(data) {
  const hourly = byHour(omitIncoming(data));
  console.log(hourly);
  var ctx = document.getElementById('byhour').getContext('2d');
  var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...Array(24).keys()],
        datasets: [{
          label: 'events per hour',
          backgroundColor: '#d8dde6',
          borderColor: 'black',
          borderWidth: 1,
          data: hourly
        }]
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
