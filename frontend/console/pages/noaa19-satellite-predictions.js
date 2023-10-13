const blessed = require('blessed');
const { service, satpredict } = require('../client/controller');

let initialized = false;
let instance;
let term;
let log;
let commandText = '';

const slug = 'noaa19-satellite-predictions';

const menuDisplay = 'NOAA-19 Passes';

const hoverDisplay = `
Prediction passes of NOAA-19
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    name: slug,
    label: ' {bold}{cyan-fg}NOAA-19{/cyan-fg}{/bold} (PM2) ',
    tags: true,
    draggable: false,
    top: 0,
    right: 0,
    width: '100%',
    height: '50%',
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
  term = blessed.terminal({
    parent: root,
    top: '50%',
    right: 0,
    height: '10%',
    width: '100%',
    border: 'line',
    tags: true,
    cursor: 'block',
    cursorBlink: true,
    label: ' {bold}{cyan-fg}Console{/cyan-fg}{/bold} (type and press enter) ',
    hidden: true,
    handler: async (e) => {
      const char = e.toString('utf8');
      const code = char.charCodeAt();
      if (code === 13) {
        await handleCommand(commandText);
        commandText = '';
        term.term.reset();
        return;
      }
      if (code === 127) {
        commandText = '';
        term.term.reset();
        return;
      }
      term.write(char);
      commandText += char;
    },
    draggable: false
  });
  term.on('click', () => {
    term.focus();
  });
  log = blessed.log({
    parent: root,
    top: '60%',
    right: 0,
    height: '40%',
    width: '100%',
    border: 'line',
    tags: true,
    label: ' {bold}{cyan-fg}Log{/cyan-fg}{/bold} ',
    hidden: true,
    draggable: false
  });
  initialized = true;
  return instance;
};

const getSatpredictStatus = async () => {
  const response = await service.satpredictStatus();
  try {
    return response.status;
  }
  catch (e) {
    return 'unknown';
  }
};

const getPredictions = async () => {
  try {
    log.log('fetching passes');
    const response = await satpredict.noaa19Predictions();
    log.log('got passes');
    return response;
  }
  catch (e) {
    log.log('failed to fetch passes');
    return {}
  }
};

const handleCommand = async (command) => {
  const [action, ...rest] = command.split(' ')
  log.log(`command: ${action}`);
}

const formatLine = (d) => {
  const orbitChars = 7;
  const elChars = 7;
  const azChars = 7;

  const est = `${d.est}`;
  const orbit = `${d.orbit}`;
  const el = `${d.el}`;
  const az = `${d.az}`;

  const orbitFmt = orbit.padStart(orbitChars, ' ');
  const elFmt = el.padStart(elChars, ' ');
  const azFmt = az.padStart(azChars, ' ');

  return `| {bold}{cyan-fg}AOS{/cyan-fg}{/bold}: ${est} ` +
    `| {bold}{cyan-fg}ORBIT{/cyan-fg}{/bold}: ${orbitFmt} ` +
    `| {bold}{cyan-fg}ELEV{/cyan-fg}{/bold}: ${elFmt} ` +
    `| {bold}{cyan-fg}AZ{/cyan-fg}{/bold}: ${azFmt} |`;
};

const activate = async () => {
  if (initialized) {
    instance.show();
    term.show();
    log.show();
    log.log('checking satpredict status');
    const status = await getSatpredictStatus();
    log.log(`satpredict status: ${status}`);
    if (status === 'unknown' || status === 'stopped') {
      return;
    }
    if (status === 'off') {
      log.log('launching satpredict');
      await service.satpredictLaunch();
    }
    const data = await getPredictions();
    const lineData = data.data.map(d => {
      return formatLine(d);
    });
    instance.setItems(lineData);
  }
};

const deactivate = async () => {
  if (initialized) {
    instance.hide();
    term.hide();
    log.hide();
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
