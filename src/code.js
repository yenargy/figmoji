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

const getUserId = async () => {
  let userId = create_UUID();

  try {
    const id = await figma.clientStorage.getAsync('userId')

    if (typeof id === 'undefined') {
      figma.clientStorage.setAsync('userId', userId).then(() => {
        figma.ui.postMessage({ data: userId, type: 'USERID' })
      });
    } else {
      userId = id;
      figma.ui.postMessage({ data: userId, type: 'USERID' })
    }
  } catch (e) {
    console.error('userId retrieving error', e)
    figma.clientStorage.setAsync('userId', userId).then(() => {
      figma.ui.postMessage({ data: userId, type: 'USERID' })
    });
  }
}

const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
