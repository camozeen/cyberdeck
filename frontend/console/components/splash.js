const blessed = require('blessed');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

let initialized = false;
let instance;
let term;

let splashBody;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  // TODO: move all ansi art dimensions to conf
  instance = blessed.box({
    parent: root,
    type: 'overlay',
    top: 'center',
    left: '50%-50',
    align: 'center',
    width: '50%',
    height: '50%',
    hidden: true,
  });
  term = blessed.terminal({
    parent: instance,
    top: 0,
    left: 0,
    height: 80,
    width: 100,
    tags: true,
    hidden: true,
    handler: function() {}
  });
  // TODO: if splash.ans does not exist, use splash.example.ans
  splashBody = await readFileAsync(__dirname + '/splash.example.ans', 'utf8');
  splashBody = splashBody.replace(/\n/gi, '\r\n');
  initialized = true;
  return instance;
};

const showSplash = () => {
  term.term.reset();
  term.term.write(splashBody);
  instance.show();
  term.show();
};

const hideSplash = () => {
  term.hide();
  instance.hide();
};

module.exports = {
  getInstance,
  showSplash,
  hideSplash
};
