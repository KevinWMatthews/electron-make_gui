const {dialog} = require('electron').remote;

let btn_select_source = document.getElementById('btn_select_source');
btn_select_source.addEventListener('click', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory', 'multiSelections']
  });
});
