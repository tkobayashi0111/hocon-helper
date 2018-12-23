class Node {
    constructor(key) {
        this.key = key;
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
}

class Root extends Node {
    constructor() {
        super(null);
    }
}

class Leaf extends Node {
    constructor(key, value) {
        super(key);
        this.value = value;
    }
}

function parse(text) {
    const nodeRegex = /^\s*([\w"]+)\s*:?\s*{\s*$/;
    const leafRegex = /^\s*([\w"]+)\s*[:=]\s*(.+?)\s*,?\s*$/;
    const closeBracketRegex = /^\s*}\s*$/;

    let currentNode = new Root();
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
        const isLastLine = i === lines.length - 1;

        const nodeMatches = line.match(nodeRegex);
        if (nodeMatches) {
            const key = trim(nodeMatches[1]);
            const node = new Node(key);
            currentNode.addChild(node);
            currentNode = node;
            return;
        }

        const leafMatches = line.match(leafRegex);
        if (leafMatches) {
            const key = trim(leafMatches[1]);
            const value = trim(leafMatches[2]);
            const leaf = new Leaf(key, value);
            if (currentNode) {
                currentNode.addChild(leaf);
            }
            if (isLastLine) {
                currentNode = leaf;
            }
            return;
        }

        const closeBracketMatches = line.match(closeBracketRegex);
        if (closeBracketMatches) {
            if (!isLastLine) {
                if (currentNode.parent) {
                    currentNode = currentNode.parent;
                } else {
                    throw new Error(`Syntax error. Line ${i}:${closeBracketMatches.index}`);
                }
            }
            return;
        }
    });

    return currentNode;
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
