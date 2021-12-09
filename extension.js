// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscuda" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscuda.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VSCuda!');
	});

	let disposableLang = vscode.languages.registerHoverProvider('cuda', {
		provideHover(document, position, token) {
			console.log("Hurray! Hover is working");
			console.log(position.toString());
			console.log(token.toString());

			const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
			console.log(word);
			if (word === "cudaMemCpy") {
				console.log("Found: " + word);
			} else {
				console.log("Sorry bro! Found instead: ", word);
			}

			return new vscode.Hover(word);
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableLang);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
