const blessed = require('blessed');
const pages = require('../pages');

let initialized = false;
let instance, selected;

const getInstance = async (root, prompt) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    label: ' {bold}{cyan-fg}Actions {/cyan-fg}{/bold} (UP-DOWN) ',
    tags: true,
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    keys: true,
    vi: true,
    mouse: true,
    border: 'line',
    hidden: true,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'cyan'
      },
      style: {
        inverse: true
      }
    },
    style: {
      item: {
        hover: {
          bg: 'blue'
        }
      },
      selected: {
        bg: 'blue',
        bold: true
      }
    },
    search: (callback) => {
      prompt.setFront();
      prompt.input('Search:', '', function(err, value) {
        if (err) return;
        return callback(null, value);
      });
    }
  });
  instance.on('click', () => {
    instance.focus();
  });
  instance.setItems(Object.keys(pages.menuDisplay2Slug));
  instance.items.forEach(item => {
    const text = item.getText();
    item.setHover(pages.menuDisplay2HoverDisplay[text]);
  });
  initialized = true;
  return instance;
};

const getSelected = () => {
  return selected;
};

const setSelected = (menuDisplay) => {
  selected = menuDisplay;
};

module.exports = {
  getInstance,
  getSelected,
  setSelected
};
