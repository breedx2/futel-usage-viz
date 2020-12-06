// Not chart specific stuff, but html helpers etc.

function showChart(id, link){
  const holders = document.querySelectorAll('.chartholder');
  for(var i=0; i < holders.length; i++){
    if(holders[i].id === id){
      showElement(holders[i]);
    }
    else {
      hideElement(holders[i]);
    }
  }

  const menuLinks = document.querySelectorAll('#chartpicker li a');
  for(var i=0; i < menuLinks.length; i++){
      deactivateChartMenuItem(menuLinks[i].parentElement);
      menuLinks[i].classList.remove('active');
  }
  activateChartMenuItem(link.parentElement);
  link.classList.add('active');
}

function showElement(em){
  em.style.display = 'block';
}

function hideElement(em){
  em.style.display = 'none';
}

function activateChartMenuItem(elem){
  elem.classList.add("active");
}

function deactivateChartMenuItem(elem){
  elem.classList.remove("active");
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

function toggleSidebar(leftId, wrapperId){
  const left = document.getElementById(leftId);
  const wrapper = document.getElementById(wrapperId);
  if(left.classList.contains('start-hidden')){
    console.log('showing sidebar');
    showSidebar(left, wrapper);
  }
  else{
    console.log('hiding sidebar');
    hideSidebar(left, wrapper);
  }
}

function showSidebar(left, wrapper){
  left.classList.remove("start-hidden");
  wrapper.classList.remove("canvas-holder");
  wrapper.classList.add("canvas-holder-compact");
}

function hideSidebar(left, wrapper){
  left.classList.add("start-hidden");
  wrapper.classList.add("canvas-holder");
  wrapper.classList.remove("canvas-holder-compact");
}
