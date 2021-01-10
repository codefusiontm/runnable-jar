const { execSync, exec } = require('child_process');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

var terminal = vscode.window.createTerminal({ name: 'Runnable JAR', hideFromUser: true });

function activate(context) {

	console.log('Congratulations, your extension "runnable-jar" is now active!');
    let disposable = vscode.commands.registerCommand('extension.runnablejar', function () {
		if (vscode.window.activeTextEditor == undefined) {
			vscode.window.showErrorMessage('Please open a main Java file to build a Runnable JAR!');
			return;
        }
		if (path.extname(vscode.window.activeTextEditor.document.fileName) != '.java') {
			vscode.window.showErrorMessage('Please open a Java file!');
			return;
		}

		let javaFile = vscode.window.activeTextEditor.document.fileName;
		let javaFilePath = path.dirname(javaFile);
		let filePath = vscode.workspace.rootPath;
		let buildPathName = 'runnable-jar';
		let buildPath = path.join(filePath, {buildPathName});
		let editorFile = path.basename(javaFile, path.extname(javaFile));
		let jarFile = path.join(buildPath, `${editorFile}.jar`);

		let commandLinux = `rm -rf ${buildPathName} && mkdir ${buildPathName} && cd ${buildPathName} && javac -d . ${javaFilePath}/* && cp -r ${filePath}/META-INF ./ && jar cvMf ${editorFile}.jar *`;
		let commandWindows = `rmdir  -r ${buildPathName} ; mkdir ${buildPathName} ; javac -d ${buildPathName} ${javaFilePath}\\* ; jar cvf ${buildPathName}\\${editorFile}.jar ${buildPathName} *`;

		terminal.dispose();
		terminal = vscode.window.createTerminal({ name: 'Build JAR', hideFromUser: true });

		if (process.platform == 'win32') {

			exec('where  powershell', (err, stdout) => {

				if (!err) {
					terminal = vscode.window.createTerminal({
						name: 'Runnable JAR', shellPath: stdout.trim(), hideFromUser: true
					});
				}

				terminal.sendText(commandWindows);
				terminal.show();
			});

		} else {

			terminal.sendText(commandLinux);
			terminal.show();
		}

		vscode.window.showInformationMessage('JAR file is being built, please check terminal for final result!');
	});

	context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
