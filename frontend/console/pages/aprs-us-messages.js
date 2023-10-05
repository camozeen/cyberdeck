const blessed = require('blessed');
const redis = require('../client/redis');
const { service } = require('../client/controller');

let initialized = false;
let instance;

const slug = 'aprs-us-message';

const menuDisplay = 'APRS US';

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    name: 'aprs-us-messages',
    label: ' {bold}{cyan-fg}Messages {/cyan-fg}{/bold} (Newest to Oldest) ',
    tags: true,
    draggable: true,
    top: 0,
    right: 0,
    width: '100%',
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
    }
  });
  initialized = true;
  return instance;
};

const listener = (message, channel) => {
  if (initialized) {
    let parsed = { data: 'ERROR', ts: 0.0 };
    try {
      parsed = JSON.parse(message);
    }
    catch (e) {
      // TODO
    }
    instance.unshiftItem(`${parsed.ts} - ${parsed.data}`);
    instance.enterSelected(0);
    instance.parent.render();
  }
};

const activate = async () => {
  if (initialized) {
    instance.show();
    await redis.getPubsub().subscribe('aprs', listener);
    await service.aprsLaunch();
  }
};

const deactivate = async () => {
  if (initialized) {
    instance.hide();
    await redis.getPubsub().unsubscribe('aprs', listener);
    await service.aprsKill();
  }
}


module.exports = {
  slug,
  menuDisplay,
  getInstance,
  activate,
  deactivate
};
