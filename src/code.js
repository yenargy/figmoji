figma.showUI(__html__, { width: 300, height: 500 });

figma.ui.onmessage = msg => {
  if (msg.type === 'insert-image') {
    const nodes = [];
    const node = figma.createNodeFromSvg(msg.svg);
    node.name = 'Emoji';
    nodes.push(node);
    const { selection } = figma.currentPage;
    if(selection.length > 0) {
      node.x = selection[0].x;
      node.y = selection[0].y
      if (selection[0].children) {
        node.x = selection[0].width/2;
        node.y = selection[0].height/2
        selection[0].appendChild(node);
      }
      nodes.push(selection[0])
    } else {
      nodes.push(figma.currentPage)
    }
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
};