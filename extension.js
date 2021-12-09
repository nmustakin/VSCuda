// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// Import the json file which contains the cuda functions such as cudaMemcpy
const cudaFuncs = require('./cuda-functions.json');

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
			//console.log(word);
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
			//console.log(position.toString());
			//console.log(token.toString());

			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);
			console.log(word);
			let pos2 = new vscode.Position(20, 17);
			//console.log(cudaFuncs[word]);
			return new vscode.Location(document.uri, pos2);
		}
	});


	const provider1 = vscode.languages.registerCompletionItemProvider('cuda', {

		provideCompletionItems(document, position, token, context) {

			// a simple completion item which inserts `Hello World!`
			const simpleCompletion = new vscode.CompletionItem('Hello World!');
			const simpleCompletion2 = new vscode.CompletionItem('Hello World!2');

			// a completion item that inserts its text as snippet,
			// the `insertText`-property is a `SnippetString` which will be
			// honored by the editor.
			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

			// a completion item that can be accepted by a commit character,
			// the `commitCharacters`-property is set which means that the completion will
			// be inserted and then the character will be typed.
			const commitCharacterCompletion = new vscode.CompletionItem('console');
			commitCharacterCompletion.commitCharacters = ['.'];
			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

			// a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('new');
			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			commandCompletion.insertText = 'new ';
			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

			// return all completion items as array
			return [
				simpleCompletion,
				simpleCompletion2,
				snippetCompletion,
				commitCharacterCompletion,
				commandCompletion
			];
		}
	});


	const providerCompletion = vscode.languages.registerCompletionItemProvider(
		'cuda',
		{
			provideCompletionItems(document, position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				console.log(position.character);
				if (!linePrefix.endsWith('cudaMemc')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'c' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableLang);
	context.subscriptions.push(disposableDef);
	context.subscriptions.push(provider1);
	context.subscriptions.push(providerCompletion);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
