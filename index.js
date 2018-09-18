const {dialog} = require('electron').remote;
const {spawn} = require('child_process');
const Convert = require('ansi-to-html');

// Wait until DOM is ready?

var convert = new Convert();

let project_root;

// Testing only, because I'm too lazy to figure out the right way to test this.
project_root = '/home/kevin/coding/c/build_terminate_program';
document.getElementById('btn_select_source').innerHTML = project_root;


// HTML element must respond to the innerHTML() method.
function printOutputToHtml(child_process, element) {
  child_process.stdout.on('data', (data) => {
    element.innerHTML += convert.toHtml(`${data}`);
  });
  child_process.stderr.on('data', (data) => {
    element.innerHTML += convert.toHtml(`${data}`);
  });
  child_process.on('error', (err) => {
    element.innerHTML += convert.toHtml(`Error: ${err.message}\n`);
  });
  child_process.on('close', (exit_code) => {
    element.innerHTML += convert.toHtml(`Exited with code: ${exit_code}\n`);
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
    let args = ['clean'];
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${args}\n`;

    const child = spawn('make', ['clean'], {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (project_root) {   //TODO look into this conditional!!
    // What if this takes a long time to execute? Will we lose scope?
    let command = 'make';
    let args = ['CLICOLOR_FORCE=1'];
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${args}\n`;

    const child = spawn(command, args, {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (project_root) {
    let command = './bin/terminate_forked';
    let args = [];
    let output = document.getElementById('pre_output');
    output.innerHTML = `Executing command: ${command} ${args}\n`;

    const child = spawn(command, args, {'cwd': project_root});
    printOutputToHtml(child, output);
  }
});
