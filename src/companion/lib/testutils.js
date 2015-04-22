import React from 'react';

export function findAllTextNodes(rootComponent) {
    var walker = document.createTreeWalker(
        React.findDOMNode(rootComponent),
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
