# Make GUI

Lightweight graphical wrapper around select Make commands.
Currently establishing proof-of-concept.


## Background

App should have something like:

 * Button to select the project root directory
 * Allow partial builds/tests: support tree navigation/file select within the project
 * Execute operations (clean, build, test, run, etc)
 * Display output of operation


## Prerequisites

This project requires [node.js](https://nodejs.org/en/).
I installed it using the [package manager](https://nodejs.org/en/download/package-manager/).


## Build

Install Electron and requried packages:

```
$ npm install
```


## Run

```
$ npm start
```

## Documentation

[Electron API](https://electronjs.org/docs/api)
[node.js API](https://nodejs.org/api/)
