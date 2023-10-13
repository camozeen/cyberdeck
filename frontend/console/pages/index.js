const cyberdeckManual = require('./cyberdeck-manual');
const aprsUsMessages = require('./aprs-us-messages');
const pmPm2 = require('./pm-pm2');
const gqrxInterface = require('./gqrx-interface');
const noaa19Predictions = require('./noaa19-satellite-predictions');
const noaa18Predictions = require('./noaa18-satellite-predictions');
const issPredictions = require('./iss-satellite-predictions');

module.exports = {
  menuDisplay2HoverDisplay: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.hoverDisplay,
    [aprsUsMessages.menuDisplay]: aprsUsMessages.hoverDisplay,
    [pmPm2.menuDisplay]: pmPm2.hoverDisplay,
    [gqrxInterface.menuDisplay]: gqrxInterface.hoverDisplay,
    [noaa19Predictions.menuDisplay]: noaa19Predictions.hoverDisplay,
    [noaa18Predictions.menuDisplay]: noaa18Predictions.hoverDisplay,
    [issPredictions.menuDisplay]: issPredictions.hoverDisplay
  },
  menuDisplay2Slug: {
    [cyberdeckManual.menuDisplay]: cyberdeckManual.slug,
    [aprsUsMessages.menuDisplay]: aprsUsMessages.slug,
    [pmPm2.menuDisplay]: pmPm2.slug,
    [gqrxInterface.menuDisplay]: gqrxInterface.slug,
    [noaa19Predictions.menuDisplay]: noaa19Predictions.slug,
    [noaa18Predictions.menuDisplay]: noaa18Predictions.slug,
    [issPredictions.menuDisplay]: issPredictions.slug
  },
  slug2Page: {
    [cyberdeckManual.slug]: cyberdeckManual,
    [aprsUsMessages.slug]: aprsUsMessages,
    [pmPm2.slug]: pmPm2,
    [gqrxInterface.slug]: gqrxInterface,
    [noaa19Predictions.slug]: noaa19Predictions,
    [noaa18Predictions.slug]: noaa18Predictions,
    [issPredictions.slug]: issPredictions
  }
};
