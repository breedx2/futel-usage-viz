// Not chart specific stuff, but html helpers etc.

function showChart(id){
  const holders = document.querySelectorAll('.chartholder');
  for(var i=0; i < holders.length; i++){
    if(holders[i].id === id){
      showElement(holders[i]);
    }
    else {
      hideElement(holders[i]);
    }
  }
}

function showElement(em){
  em.style.display = 'block';
}

function hideElement(em){
  em.style.display = 'none';
}
