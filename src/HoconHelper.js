const vscode = require('vscode');
const HoconTree = require('./HoconTree');

class HoconHelper {
    static getKey() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'properties') {
            return null;
        }

        const document = editor.document;
        const anchor = editor.selection.anchor;
        const anchorLine = document.lineAt(anchor.line);
        const targetText = document.getText(new vscode.Range(0, 0, anchorLine.lineNumber, anchorLine.text.length));
        const { targetNode } = HoconTree.parse(targetText);
        return targetNode ? targetNode.getKey() : '';
    }

    static search(key) {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'properties') {
            return null;
        }

        const document = editor.document;
        const { rootNode } = HoconTree.parse(document.getText());
        const targetNode = rootNode.search(key);
        return targetNode;
    }
}

module.exports = HoconHelper;
