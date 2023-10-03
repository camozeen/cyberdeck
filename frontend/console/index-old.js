const blessed = require('blessed');
const { createClient } = require('redis');

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};


const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true
});

var loader = blessed.loading({
  parent: screen,
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

const list = blessed.list({
  parent: screen,
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
  }
});


var content = blessed.box({
  parent: screen,
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  hidden: true,
});

const contentPromptContent = `
Welcome

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.


{bold}{cyan-fg}APRS Messages {/cyan-fg}{/bold}
this is some other text
`;

const contentPrompt = blessed.box({
  parent: content,
  hidden: true,
  tags: true,
  top: 0,
  right: 0,
  width: '100%',
  height: '100%',
  label: ' {bold}{cyan-fg}Cyberdeck {/cyan-fg}{/bold} (Info and Help) ',
  border: 'line',
  content: contentPromptContent
})

const aprsMessages = blessed.list({
  parent: content,
  name: 'aprs-messages-us',
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


/*
const _messages = [];
setInterval(() => {
  option 1
  _messages.unshift(`APRS>TEST: ${Math.random()}`);
  messages.setItems(_messages);
  messages.enterSelected(0);
  screen.render();

  option 2
  aprsMessages.unshiftItem(`APRS>TEST: ${Math.random()}`);
  aprsMessages.enterSelected(0);
  screen.render();
}, 2000);
*/

(async () => {
  screen.render();
  loader.load('Initializing');
  await delay(1000);
  loader.setContent('Fetching Available Actions');
  list.setItems([
    '(None)',
    'APRS',
    'FM'
  ]);
  list.items[0].setHover('hover');
  list.items[1].setHover('APRS Messages');
  list.items[2].setHover('FM Radio');


  list.on('select', function(el, selected) {
    if (list._.rendering) return;

    var name = el.getText();
    if (name === '(None)') {
      contentPrompt.show();
      aprsMessages.hide();
      screen.render();
      return;
    }

    list._.rendering = true;
    loader.setFront();
    loader.load(`Loading ${name}`);
    setTimeout(() => {
      list._.rendering = false;
      loader.stop();
      if (name === 'APRS') {
        contentPrompt.hide();
        aprsMessages.show();
      }
      screen.render();
    }, 1000);
  });

  list.focus();
  list.enterSelected(0);

  screen.key('q', function() {
    return process.exit(0);
  });

  await delay(1000);
  list.show();
  content.show();
  screen.render();
  loader.stop();

})();
