const {dialog} = require('electron').remote;
const {BrowserWindow} = require('electron').remote;
const {spawn} = require('child_process');
const Convert = require('ansi-to-html');

// Wait until DOM is ready?

let project_root;
const convert = new Convert();

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
  let log_base = document.getElementById('div_log');
  clearOutputLog(log_base);
  let log_element = addLogElement(log_base, 'output_clean');
  spawnAndLog(command, args, options, log_element);
});

let btn_compile = document.getElementById('btn_compile');
btn_compile.addEventListener('click', (event) => {
  if (!project_root) {
    return;
  }
  let command = 'make';
  let args = ['CLICOLOR_FORCE=1'];
  let options = {'cwd': project_root};
  let log_base = document.getElementById('div_log');
  clearOutputLog(log_base);
  let log_element = addLogElement(log_base, 'output_clean');
  spawnAndLog(command, args, options, log_element);
});

let testWindow;

function createTestWidow() {
  testWindow = new BrowserWindow({width: 800, height: 600});
  testWindow.loadFile('test.html');
  // if (testWindow) { testWindow.focus() } ?
  testWindow.on('closed', () => {
    testWindow = null;
  });
}

let btn_test = document.getElementById('btn_test');
btn_test.addEventListener('click', (event) => {
  if (!project_root) {
    return;
  }
  createTestWidow();
});

//
// Run
//
let select_files = document.getElementById('select_files');

let select_files_add = document.getElementById('select_files_add');
select_files_add.addEventListener('click', (event) => {
  let dialog_properties = {
    defaultPath: project_root,
    properties: ['openFile', 'multiSelections']
  };
  file_paths = dialog.showOpenDialog(dialog_properties);
  if (!file_paths) {
    return;
  }
  file_paths.forEach((element) => {
    let option = new Option(element);
    select_files.add(option);
  });
});

let select_files_remove = document.getElementById('select_files_remove');
select_files_remove.addEventListener('click', (event) => {
  while (select_files.options.selectedIndex != -1) {
    select_files.remove(select_files.options.selectedIndex);
  }
});

let btn_run = document.getElementById('btn_run');
btn_run.addEventListener('click', (event) => {
  if (!project_root) {
    return;
  }
  let commands = [...select_files.options].map(option => option.value);
  let args = [];
  let options = {'cwd': project_root};
  let log_base = document.getElementById('div_log');
  clearOutputLog(log_base);
  commands.forEach( (command, index) => {
    let log_element = addLogElement(log_base, `output_clean_${index}`);
    spawnAndLog(command, args, options, log_element);
  });
});



// Spawn the command in a child process with the given arguments and options.
// Colorize and send all output to the log element.
//
// log must respond to innerHTML.
function spawnAndLog(command, args, options, log) {
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

// Add a log element with the given id to the parent element.
// Returns the new element.
function addLogElement(parent, id) {
  element = document.createElement("pre");
  element.setAttribute('id', id);
  parent.appendChild(element);
  return element;
}

// Remove all log elements from the page
function clearOutputLog(element) {
  while (element.childElementCount > 0) {
    element.removeChild(element.lastChild);
  }
}

// Colorize input data (convert it to a span) and add it to the element.
// element must respond to the innerHTML() method.
function sendToOutputLog(element, data) {
  element.innerHTML += convert.toHtml(`${data}`);
}
