const cyberdeckManual = require('./cyberdeck-manual');
const aprsUsMessages = require('./aprs-us-messages');

module.exports = {
  menuDisplay2HoverDisplay: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.hoverDisplay,
    [aprsUsMessages.menuDisplay]: aprsUsMessages.hoverDisplay
  },
  menuDisplay2Slug: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.slug, // TODO: make object { slug, hoverText }
    [aprsUsMessages.menuDisplay]: aprsUsMessages.slug
  },
  slug2Page: {
    [cyberdeckManual.slug]: cyberdeckManual,
    [aprsUsMessages.slug]: aprsUsMessages
  }
};
