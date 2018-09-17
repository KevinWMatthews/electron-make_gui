const {dialog} = require('electron').remote;
const {spawn} = require('child_process');

// Wait until DOM is ready?

let project_root;

// Testing only, because I'm too lazy to figure out the right way to test this.
project_root = '/home/kevin/coding/c/build_terminate_program';
document.getElementById('btn_select_source').innerHTML = project_root;

// HTML element must respond to the innerHTML() method.
function printOutputToHtml(child_process, element) {
  child_process.stdout.on('data', (data) => {
    element.innerHTML += data;
  });
  child_process.stderr.on('data', (data) => {
    element.innerHTML += data;
  });
  child_process.on('error', (err) => {
    element.innerHTML += `Error: ${err.message}\n`;
  });
  child_process.on('close', (exit_code) => {
    element.innerHTML += `Exited with code: ${exit_code}\n`;
  });
}


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
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;

    const child = spawn('make', ['clean'], {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    let command = 'make';
    let options = [];
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;

    const child = spawn(command, options, {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (project_root) {
    let command = './bin/terminate_forked';
    let options = [];
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${options}\n`;

    const child = spawn(command, options, {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});
