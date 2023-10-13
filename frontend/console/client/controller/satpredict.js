const axios = require('axios');
const utils = require('./utils');

const noaa19Predictions = async () => {
  const url = utils.makeUrl('/satpredict/predictions');
  try {
    const res = await axios.post(url, {
      name: 'NOAA-19',
      downlink_hz: '137100000',
    });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const noaa18Predictions = async () => {
  const url = utils.makeUrl('/satpredict/predictions');
  try {
    const res = await axios.post(url, {
      name: 'NOAA-18',
      downlink_hz: '137912500',
    });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const issPredictions = async () => {
  const url = utils.makeUrl('/satpredict/predictions');
  try {
    const res = await axios.post(url, {
      name: 'ISS',
      downlink_hz: '437800000',
    });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};


module.exports = {
  noaa19Predictions,
  noaa18Predictions,
  issPredictions
};
