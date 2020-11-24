
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
