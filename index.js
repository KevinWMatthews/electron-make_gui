const {dialog} = require('electron').remote;
const {spawn} = require('child_process');

// Wait until DOM is ready?

let project_root;

let btn_select_source = document.getElementById('btn_select_source');
btn_select_source.addEventListener('click', (event) => {
  let source_dir = dialog.showOpenDialog({
    properties: ['openDirectory', 'multiSelections']
  });
  event.target.innerHTML = source_dir;
  project_root = source_dir;
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
