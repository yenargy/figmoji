figma.showUI(__html__, { width: 280, height: 500 });

figma.ui.onmessage = msg => {
  if (msg.type === 'insert-image') {
    const nodes = [];
    const node = figma.createNodeFromSvg(msg.svg);
    const group = figma.group(node.children, figma.currentPage);
    node.remove();
    group.name = 'Emoji'
    nodes.push(group);
    if(figma.currentPage.selection.length > 0) {
      const selection = figma.currentPage.selection[0];
      group.x = selection.x;
      group.y = selection.y
      if (selection.type.toLowerCase() === 'frame' && selection.children) {
        group.x = selection.width/2;
        group.y = selection.height/2
        selection.appendChild(group);
      } else {
        selection.parent.appendChild(group);
        group.x = selection.x + selection.width + 10;
        group.y = selection.y;
      }
      nodes.push(selection)
    } else {
      nodes.push(figma.currentPage)
    }
    figma.currentPage.selection = [group];
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.ui.postMessage({ type: 'INSERT_SUCCESSFUL' })
  }
};
