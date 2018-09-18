const {dialog} = require('electron').remote;
const {spawn} = require('child_process');
const Convert = require('ansi-to-html');

// Wait until DOM is ready?

var convert = new Convert();

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
  if (!project_root) {
    return;
  }
  let command = 'make';
  let args = ['clean'];
  let options = {'cwd': project_root};
  let log = document.getElementById('pre_output_log');
  spawnAndLog(command, args, options, log);
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (!project_root) {
    return;
  }
  let command = 'make';
  let args = ['CLICOLOR_FORCE=1'];
  let options = {'cwd': project_root};
  let log = document.getElementById('pre_output_log');
  spawnAndLog(command, args, options, log);
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (!project_root) {
    return;
  }
  let command = './bin/terminate_forked';
  let args = [];
  let options = {'cwd': project_root};
  let log = document.getElementById('pre_output_log');
  spawnAndLog(command, args, options, log);
});

// Spawn the command in a child process with the given arguments and options.
// Colorize and send all output to the log element.
//
// log must respond to innerHTML.
function spawnAndLog(command, args, options, log) {
  clearOutputLog(log);
  sendToOutputLog(log, `Executing command: ${command} ${args}\n`);
  const child = spawn(command, args, options);
  printProcessOutputToHtml(child, log);
}

// Capture output from child_process events and send it to HTML.
function printProcessOutputToHtml(child_process, element) {
  child_process.stdout.on('data', (data) => {
    sendToOutputLog(element, data);
  });
  child_process.stderr.on('data', (data) => {
    sendToOutputLog(element, data);
  });
  child_process.on('error', (err) => {
    sendToOutputLog(element, `Error: ${err.message}\n`);
  });
  child_process.on('close', (exit_code) => {
    sendToOutputLog(element, `Exited with code: ${exit_code}\n`);
  });
}

// Clear the inner HTML of the element.
function clearOutputLog(element) {
  element.innerHTML = '';
}

// Colorize input data (convert it to a span) and add it to the element.
// element must respond to the innerHTML() method.
function sendToOutputLog(element, data) {
  element.innerHTML += convert.toHtml(`${data}`);
}
