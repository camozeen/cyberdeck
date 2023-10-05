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
    draggable: true,
    top: 0,
    left: 0,
    width: '50%',
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
  instance.setItems(Object.keys(pages.menuDisplay2Slug));
  /*
  instance.items[0].setHover('hover');
  instance.items[1].setHover('APRS Messages');
  instance.items[2].setHover('FM Radio');
  */
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
