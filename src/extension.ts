const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

var terminal = vscode.window.createTerminal({ name: 'Runnable JAR', hideFromUser: true });
