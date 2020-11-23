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

//attribution: https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function stringToColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
