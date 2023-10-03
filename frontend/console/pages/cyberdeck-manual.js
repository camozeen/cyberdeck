const blessed = require('blessed');

let initialized = false;
let instance;

const slug = 'cyberdeck-manual';

const menuDisplay = 'Cyberdeck Manual';

const content = `
Welcome

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.


{bold}{cyan-fg}APRS Messages {/cyan-fg}{/bold}
this is some other text
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.box({
    parent: root,
    name: 'cyberdeck-manual',
    hidden: true,
    tags: true,
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    label: ' {bold}{cyan-fg}Cyberdeck {/cyan-fg}{/bold} (Info and Help) ',
    border: 'line',
    content
  })
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
  getInstance,
  activate,
  deactivate
};
