
async function configurePresets() {
  const monthlyPresets = await fetchByMonthPresets();
  configurePresetsFor(monthlyPresets, 'bymonthpresets', 'bymonthsel');
}

function fetchByMonthPresets(){
  return fetch('./presets-bymonth.json')
    .then(response => response.json());
}

function configurePresetsFor(mappings, presetId, targetId){
  const presetSel = document.getElementById(presetId);
  Object.keys(mappings).forEach(preset => {
    const option = document.createElement('option');
    option.text = preset;
    presetSel.add(option);
  });
  presetSel.addEventListener('change', () => {
    const targets = mappings[presetSel.value];
    for (const option of document.querySelectorAll(`#${targetId} option`)) {
      if(targets.includes(option.value)){
        option.setAttribute('selected', true);
      }
      else{
        option.removeAttribute('selected');
      }
    }
    document.getElementById(targetId).dispatchEvent(new Event('change'));
  });
}
