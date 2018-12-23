const vscode = require('vscode');
const HoconHelper = require('./HoconHelper');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposableCopy = vscode.commands.registerCommand('extension.copyHoconKey', () => {
        const key = HoconHelper.getKey();

        if (key) {
            vscode.env.clipboard.writeText(key).then(() => {
                vscode.window.setStatusBarMessage(`"${key}" is copied!`, 3000);
            });
        }
    });

    const disposableSearch = vscode.commands.registerCommand('extension.searchHoconKey', () => {
        vscode.window.showInputBox().then((key) => {
            if (!key) return;

            const node = HoconHelper.search(key);
            if (node) {
                const editor = vscode.window.activeTextEditor;
                const position = new vscode.Position(node.line, node.column);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
            } else {
                vscode.window.setStatusBarMessage(`"${key}" is not found.`, 3000);
            }
        });
    });

    context.subscriptions.push(disposableCopy);
    context.subscriptions.push(disposableSearch);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
