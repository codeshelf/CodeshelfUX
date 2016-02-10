import React from 'react';
import ReactDOM from 'react-dom';

export function findAllTextNodes(rootComponent) {
    var walker = document.createTreeWalker(
        ReactDOM.findDOMNode(rootComponent),
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    var node;
    var textNodes = [];

    while(node = walker.nextNode()) {
        textNodes.push(node.nodeValue);
    }
    return textNodes;
}
