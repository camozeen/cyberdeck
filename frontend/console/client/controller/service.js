const axios = require('axios');
const utils = require('./utils');

const aprsLaunch = async () => {
  const url = utils.makeUrl('/services/aprs/launch');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const aprsKill = async () => {
  const url = utils.makeUrl('/services/aprs/kill');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const gqrxLaunch = async () => {
  const url = utils.makeUrl('/services/gqrx/launch');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const gqrxKill = async () => {
  const url = utils.makeUrl('/services/gqrx/kill');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const gqrxStatus = async () => {
  const url = utils.makeUrl('/services/gqrx/status');
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

module.exports = {
  aprsLaunch,
  aprsKill,
  gqrxLaunch,
  gqrxKill,
  gqrxStatus
};
