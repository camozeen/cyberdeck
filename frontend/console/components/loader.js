const blessed = require('blessed');

let initialized = false;
let instance;

module.exports.getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.loading({
    parent: root,
    type: 'overlay',
    top: 'center',
    left: 'center',
    height: 5,
    align: 'center',
    width: '50%',
    tags: true,
    hidden: true,
    border: 'line'
  });
  initialized = true;
  return instance;
};
