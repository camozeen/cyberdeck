const cyberdeckManual = require('./cyberdeck-manual');
const aprsUsMessages = require('./aprs-us-messages');
const pmPm2 = require('./pm-pm2');

module.exports = {
  menuDisplay2HoverDisplay: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.hoverDisplay,
    [aprsUsMessages.menuDisplay]: aprsUsMessages.hoverDisplay,
    [pmPm2.menuDisplay]: pmPm2.hoverDisplay
  },
  menuDisplay2Slug: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.slug,
    [aprsUsMessages.menuDisplay]: aprsUsMessages.slug,
    [pmPm2.menuDisplay]: pmPm2.slug
  },
  slug2Page: {
    [cyberdeckManual.slug]: cyberdeckManual,
    [aprsUsMessages.slug]: aprsUsMessages,
    [pmPm2.slug]: pmPm2
  }
};
