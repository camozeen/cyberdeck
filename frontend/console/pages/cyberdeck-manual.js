const blessed = require('blessed');
const { docs } = require('../client/controller');

let initialized = false;
let instance;

const slug = 'cyberdeck-manual';

const menuDisplay = 'Cyberdeck Manual';

const hoverDisplay = `
Cyberdeck manual pages describing each module in this list
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  const content = await docs.docBySlug(slug);
  instance = blessed.box({
    parent: root,
    name: slug,
    hidden: true,
    tags: true,
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    label: ' {bold}{cyan-fg}Cyberdeck {/cyan-fg}{/bold} (Info and Help) ',
    border: 'line',
    content: content.doc
  })
  instance.on('click', () => {
    instance.focus();
  });
  initialized = true;
  return instance;
};

const activate = async () => {
  if (initialized) {
    instance.show();
  }
};

const deactivate = async () => {
  if (initialized) {
    instance.hide();
  }
}

module.exports = {
  slug,
  menuDisplay,
  hoverDisplay,
  getInstance,
  activate,
  deactivate
};
