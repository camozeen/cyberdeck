const blessed = require('blessed');
const { pm } = require('../client/controller');

let initialized = false;
let instance;
let term;
let log;
let commandText = '';

const slug = 'pm-pm2';

const menuDisplay = 'Process Manager (PM2)';

const hoverDisplay = `
Interact with processes lauched via PM2
`;

const getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.list({
    parent: root,
    name: slug,
    label: ' {bold}{cyan-fg}Processes{/cyan-fg}{/bold} (PM2) ',
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

const handleCommand = async (command) => {
  log.log(`executing: ${command}`);
}

const fetchList = async () => {
  if (initialized) {
    const response = await pm.pm2List();
    let parsed = []; 
    try {
      parsed = response.map(r => {
        return `id: ${r.pm_id} - status: ${r.pm2_env.status} - name: ${r.name}`;
      });
    }
    catch (e) {
      // TODO
    }
    instance.setItems(parsed);
    instance.parent.render();
  }
};

const activate = async () => {
  if (initialized) {
    instance.show();
    term.show();
    log.show();
    await fetchList();
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
