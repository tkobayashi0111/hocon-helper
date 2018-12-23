const vscode = require('vscode');
const HoconHelper = require('./HoconHelper');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "hocon-helper" is now active!');

    const disposable = vscode.commands.registerCommand('extension.copyHoconKey', () => {
        const key = HoconHelper.getKey();
        vscode.env.clipboard.writeText(key);
        console.log(key);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
