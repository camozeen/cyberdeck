const blessed = require('blessed');
const redis = require('../client/redis');
const { service } = require('../client/controller');

let initialized = false;
let instance;

const slug = 'aprs-us-rtlsdr-message';

const menuDisplay = 'APRS US from RTL-SDR';

const hoverDisplay = `
Stream APRS messages from RTL-SDR dongle tuned to standard US channel 144.390 MHz.
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    name: slug,
    label: ' {bold}{cyan-fg}Messages {/cyan-fg}{/bold} (Newest to Oldest) ',
    tags: true,
    draggable: false,
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
  instance.on('click', () => {
    instance.focus();
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
  hoverDisplay,
  getInstance,
  activate,
  deactivate
};
