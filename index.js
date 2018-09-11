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

let btn_clean = document.getElementById('btn_clean');
btn_clean.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    const make_clean = spawn('make', ['clean'], {'cwd': project_root});

    make_clean.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    make_clean.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    })
    make_clean.on('close', (exit_code) => {
      console.log(`Exited with code: ${exit_code}`);
    })
  }
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    const make_all = spawn('make', [], {'cwd': project_root});

    make_all.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    make_all.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    })
    make_all.on('close', (exit_code) => {
      console.log(`Exited with code: ${exit_code}`);
    })
  }
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (project_root) {
    const run_program = spawn('./bin/terminate_forked', {'cwd': project_root});

    run_program.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    run_program.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    run_program.on('close', (exit_code) => {
      console.log(`Exited with code: ${exit_code}`);
    });
  }
});
