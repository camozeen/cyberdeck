const blessed = require('blessed');
const { service, gqrx } = require('../client/controller');

let initialized = false;
let instance;
let term;
let log;
let commandText = '';

const slug = 'gqrx-interface';

const menuDisplay = 'GQRX Interface';

const hoverDisplay = `
GQRX Interface
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    name: slug,
    label: ' {bold}{cyan-fg}Info{/cyan-fg}{/bold} (PM2) ',
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

const getGqrxStatus = async () => {
  const response = await service.gqrxStatus();
  try {
    return response.status;
  }
  catch (e) {
    return 'unknown';
  }
};

const handleCommand = async (command) => {
  const [action, ...rest] = command.split(' ')
  if (action === 'tune') {
    if (rest.length > 0) {
      const hz = parseInt(rest[0]);
      await gqrx.setFrequency(hz);
      log.log(`tuning to frequency ${hz}`);
    } else {
      const result = await gqrx.getFrequency();
      log.log(`current frequency ${result.hz}`);
    }
    return;
  }

  if (action === 'mode') {
    if (rest.length > 0) {
      const mode = rest[0];
      const passband_hz = parseInt(rest[1]);
      await gqrx.setMode(mode, passband_hz);
      log.log(`setting mode ${mode} ${passband_hz}`);
    } else {
      const result = await gqrx.getMode();
      log.log(`current mode ${result.mode} ${result.passband_hz}`);
    }
    return;
  }

  if (action === 'connect') {
    await gqrx.connect();
    log.log('do connect');
  }

  if (action === 'close') {
    await gqrx.close();
    log.log('do close');
  }

  if (action === 'kill') {
    await service.gqrxKill();
    log.log('do kill');
  }

  if (action === 'dsp') {
    if (rest.length > 0) {
      const flag = rest[0] === '1' ? true : false;
      await gqrx.setDspState(flag);
      log.log(`dsp ${flag}`);
    } else {
      const result = await gqrx.getDspState();
      log.log(`current dsp ${result.is_on}`);
    }
    return;
  }

  if (action === 'rec') {
    if (rest.length > 0) {
      const op = rest[0];
      if (op === 'start') {
        await gqrx.startRecording();
        log.log(`start rec`);
      } else if (op === 'stop') {
        await gqrx.stopRecording();
        log.log(`stop rec`);
      } else {
        log.log(`rec bad command`);
      }
    }
    return;
  }
}

const activate = async () => {
  if (initialized) {
    instance.show();
    term.show();
    log.show();
    log.log('checking gqrx status');
    const status = await getGqrxStatus();
    log.log(`gqrx status: ${status}`);
    if (status === 'online' || status === 'unknown' || status === 'stopped') {
      return;
    }
    if (status === 'off') {
      log.log('launching gqrx');
      await service.gqrxLaunch();
    }
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
