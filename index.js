const {dialog} = require('electron').remote;
const {spawn} = require('child_process');

// Wait until DOM is ready?

let project_root;

let btn_select_source = document.getElementById('btn_select_source');
btn_select_source.addEventListener('click', (event) => {
  let dialog_properties = {
    properties: ['openDirectory', 'multiSelections']
  };
  dialog.showOpenDialog(dialog_properties, (filePaths) => {
    // Hard-code to a single file path for now.
    let file_path = filePaths[0];
    event.target.innerHTML = file_path;
    project_root = file_path;
  });
});

let btn_test = document.getElementById('btn_test');
btn_test.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    const ls = spawn('ls', ['-lh', project_root]);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    })
    ls.on('close', (exit_code) => {
      console.log(`Exited with code: ${exit_code}`);
    })
  }
})
