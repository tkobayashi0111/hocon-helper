class Node {
    constructor(key, line, column) {
        this.key = key;
        this.line = line;
        this.column = column;
        this.parent = null;
        this.children = [];
    }

    setParent(parent) {
        if (this.parent) {
            throw new Error('already has parent');
        } else {
            this.parent = parent;
            parent.children.push(this);
        }
    }

    addChild(child) {
        if (child.parent) {
            throw new Error('child already has parent');
        } else {
            child.parent = this;
            this.children.push(child);
        }
    }

    addChildFromKey(line, column, key, value = null) {
        const keys = key.split('.');
        let node = this;
        keys.forEach((_key, i) => {
            const isLastKey = i === keys.length;
            const _node = node;
            if (!isLastKey || !value) {
                node = new Node(_key, line, column);
            } else if (value) {
                node = new Leaf(_key, value, line, column);
            }
            _node.addChild(node);
        })
        return node;
    }

    getKey() {
        if (this instanceof Root) {
            return '';
        }

        const keys = [this.key];
        let parent = this.parent;
        while (!(parent instanceof Root)) {
            keys.push(parent.key);
            parent = parent.parent;
        }

        return keys.reverse().join('.');
    }

    search(key) {
        const keys = key.split('.');
        const node = this.children.find((child) => child.key === keys[0]);
        if (!node) {
            return null;
        }

        if (keys.length === 1) {
            return node;
        } else {
            return node.search(keys.slice(1).join('.'));
        }
    }
}

class Root extends Node {
    constructor() {
        super(null);
    }
}

class Leaf extends Node {
    constructor(key, value, line, column) {
        super(key, line, column);
        this.value = value;
    }
}

function parse(text) {
    const nodeRegex = /([\w"\.]+)\s*[:=]?\s*{\s*$/;
    const leafRegex = /([\w"\.]+)\s*[:=]\s*(.+?)\s*,?\s*$/;
    const closeBracketRegex = /^\s*}\s*$/;
    let isClosed = false;

    const rootNode = new Root();
    let currentNode = rootNode;
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
        const isLastLine = i === lines.length - 1;

        if (isClosed) {
            currentNode = currentNode.parent;
            isClosed = false;
        }

        const nodeMatches = line.match(nodeRegex);
        if (nodeMatches) {
            const key = trim(nodeMatches[1]);
            const node = currentNode.addChildFromKey(i, nodeMatches.index, key);
            currentNode = node;
            return;
        }

        const leafMatches = line.match(leafRegex);
        if (leafMatches) {
            const key = trim(leafMatches[1]);
            const value = trim(leafMatches[2]);
            const node = currentNode.addChildFromKey(i, leafMatches.index, key, value);
            if (isLastLine) {
                currentNode = node;
            }
            return;
        }

        const closeBracketMatches = line.match(closeBracketRegex);
        if (closeBracketMatches) {
            isClosed = true;
            return;
        }
    });

    return {
        rootNode,
        targetNode: currentNode,
    };
}

function trim(value) {
    // can't use startsWith and endsWith
    if (value.indexOf('"""') === 0 && value.lastIndexOf('"""') === value.length - '"""'.length) {
        return value.replace(/^"""(.*)"""$/, '$1');
    } else if (value.indexOf('"') === 0 && value.lastIndexOf('"') === value.length - '"'.length) {
        return value.replace(/^"(.*)"$/, '$1');
    } else {
        return value;
    }
}

module.exports = {
    Node,
    Leaf,
    parse
};
