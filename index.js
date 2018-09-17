const {dialog} = require('electron').remote;
const {spawn} = require('child_process');

// Wait until DOM is ready?

let project_root;

// Testing only, because I'm too lazy to figure out the right way to test this.
project_root = '/home/kevin/coding/c/build_terminate_program';
document.getElementById('btn_select_source').innerHTML = project_root;


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
    let command = 'make';
    let options = ['clean'];
    const make_clean = spawn('make', ['clean'], {'cwd': project_root});

    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;
    make_clean.stdout.on('data', (data) => {
      output.innerHTML += data;
    });
    make_clean.stderr.on('data', (data) => {
      output.innerHTML += data;
    });
    make_clean.on('error', (err) => {
      output.innerHTML += `Error: ${err.message}\n`;
    });
    make_clean.on('close', (exit_code) => {
      output.innerHTML += `Exited with code: ${exit_code}\n`;
    });
  }
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    let command = 'make';
    let options = [];
    const make_all = spawn(command, options, {'cwd': project_root});

    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;
    make_all.stdout.on('data', (data) => {
      output.innerHTML += data;
    });
    make_all.stderr.on('data', (data) => {
      output.innerHTML += data;
    });
    make_all.on('error', (err) => {
      output.innerHTML += `Error: ${err.message}\n`;
    });
    make_all.on('close', (exit_code) => {
      output.innerHTML += `Exited with code: ${exit_code}\n`;
    });
  }
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (project_root) {
    let command = './bin/terminate_forked';
    let options = [];
    const run_program = spawn(command, options, {'cwd': project_root});

    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;
    run_program.stdout.on('data', (data) => {
      output.innerHTML += data;
    });
    run_program.stderr.on('data', (data) => {
      output.innerHTML += data;
    });
    run_program.on('error', (err) => {
      output.innerHTML += `Error: ${err.message}\n`;
    });
    run_program.on('close', (exit_code) => {
      if (exit_code != 0) {
        output.innerHTML += `Exited with code: ${exit_code}\n`;
      }
    });
  }
});
