// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// Import the path module
const path = require('path');
// Import the json file which contains the cuda functions such as cudaMemcpy
const cudaFuncs = require('./cuda-functions.json');
// Import the json file which contains common cuda fucntion structures
const cudaCommonFuncs = require('./cuda-common.json');

let diagnosticCollection;

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
			//console.log("Hurray! Hover is working");
			//console.log(position.toString());
			//console.log(token.toString());

			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);
			// console.log(word);
			//console.log(cudaFuncs[word]);
			try {
				if (word === cudaFuncs[word].id) {
					console.log("Found: " + word);
					return new vscode.Hover(cudaFuncs[word].value);
				} else {
					//console.log("Sorry bro! Found instead: ", word);
				}
			}
			catch (err) {

			}
		}
	});

	let disposableDef = vscode.languages.registerDefinitionProvider('cuda', {
		provideDefinition(document, position, token) {
			console.log("Hurray! Definition is working");
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);
			console.log(word);
			let pos2 = new vscode.Position(20, 17);
			return new vscode.Location(document.uri, pos2);
		}
	});


	const disposableCompletionProvider = vscode.languages.registerCompletionItemProvider('cuda', {

		provideCompletionItems(document, position, token, context) {
			const completionList = [];

			cudaCommonFuncs.forEach(element => {
				const snippetCompletion = new vscode.CompletionItem(element.id);
				snippetCompletion.insertText = new vscode.SnippetString(element.value);
				try {
					snippetCompletion.documentation = new vscode.MarkdownString(cudaFuncs[element.id].value);
				} catch (err) {
					console.log(err);
				}
				completionList.push(snippetCompletion);
			});

			return completionList;
		}
	});

	/*
	let disposableReferenceProvider = vscode.languages.registerReferenceProvider('cuda', {
		provideReferences(document, pos, options, token) {
			//console.log("Hurray! Hover is working");
			//console.log(position.toString());
			//console.log(token.toString());

			const range = document.getWordRangeAtPosition(pos);
			const word = document.getText(range);
			let target = document.uri;
			console.log(word);
			console.log(target);
			console.log(target.toString());
			console.log(pos);
			// return vscode.commands.executeCommand('vscode.executeReferenceProvider', target, pos).then(locations => {
			// 	locations = locations || [];

			// 	// sort by locations and shuffle to begin from target resource
			// 	let idx = 0;
			// 	locations.sort(Provider._compareLocations).find((loc, i) => loc.uri.toString() === target.toString() && !!(idx = i) && true);
			// 	locations.push(...locations.splice(0, idx));

			// 	// create document and return its early state
			// 	const document = new ReferencesDocument(uri, locations, this._onDidChange);
			// 	this._documents.set(uri.toString(), document);
			// 	console.log(document.value);
			// 	return document.value;
			// });
		}
	});
	*/

	diagnosticCollection = vscode.languages.createDiagnosticCollection('cuda');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
	}
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, diagnosticCollection);
		}
	}));

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableLang);
	context.subscriptions.push(disposableDef);
	context.subscriptions.push(disposableCompletionProvider);
	//context.subscriptions.push(disposableReferenceProvider);
}

function updateDiagnostics(document, collection) {
	console.log("updateDiagnostic");
	if (document && path.basename(document.uri.fsPath) === 'x.cu') {
		collection.set(document.uri, [{
			code: '',
			message: 'cannot assign twice to immutable variable `x`',
			range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
			severity: vscode.DiagnosticSeverity.Error,
			source: '',
			relatedInformation: [
				new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
			]
		}]);
	} else {
		collection.clear();
	}
}


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
