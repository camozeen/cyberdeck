const blessed = require('blessed');

const redis = require('./client/redis');

const screen = require('./components/screen');
const loader = require('./components/loader');
const actionContent = require('./components/action-content');
const actionMenu = require('./components/action-menu');

const pages = require('./pages');

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};


(async () => {
  const _screen = await screen.getInstance();
  const _loader = await loader.getInstance(_screen);
  _screen.render();

  _loader.load('Initializing');
  await delay(1000);

  _loader.setContent('Starting cache');
  await delay(1000);
  await redis.initialize();

  _loader.setContent('Fetching Available Action List');
  await delay(1000);
  const _actionMenu = await actionMenu.getInstance(_screen);
  const _actionContent = await actionContent.getInstance(_screen);

  _loader.setContent('Loading Actions');
  await delay(1000);
  for (const p of Object.values(pages.slug2Page)) {
    await p.getInstance(_actionContent);
  }

  actionMenu.setSelected(Object.keys(pages.menuDisplay2Slug)[0]);
  _actionMenu.on('select', async function(el, selected) {
    if (_actionMenu._.rendering) return;

    _loader.load('Please Wait');
    _loader.setFront();
    _actionMenu._.rendering = true;

    await delay(1000);

    const previous = await pages.slug2Page[pages.menuDisplay2Slug[actionMenu.getSelected()]];
    await previous.deactivate();

    _loader.setContent(`Loading ${actionMenu.getSelected()}`);
    const current = await pages.slug2Page[pages.menuDisplay2Slug[el.getText()]];
    await current.activate();

    actionMenu.setSelected(el.getText())
    
    _actionMenu._.rendering = false;
    _loader.stop();
    _screen.render();
  });

  _loader.stop();
  _actionMenu.show();
  _actionContent.show();
  _screen.render();

  _actionMenu.focus();
  _actionMenu.enterSelected(0);

  _screen.key('q', function() {
    return process.exit(0);
  });

})();
