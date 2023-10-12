const axios = require('axios');
const utils = require('./utils');

/*
@app.route('/gqrx/connect', methods=['POST'])
@app.route('/gqrx/close', methods=['POST'])
@app.route('/gqrx/frequency', methods=['GET', 'POST'])
@app.route('/gqrx/mode', methods=['GET', 'POST'])
@app.route('/gqrx/dsp', methods=['GET', 'POST'])
@app.route('/gqrx/record/start', methods=['POST'])
@app.route('/gqrx/record/stop', methods=['POST'])
*/

const connect = async () => {
  const url = utils.makeUrl('/gqrx/connect');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const close = async () => {
  const url = utils.makeUrl('/gqrx/close');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const getFrequency = async () => {
  const url = utils.makeUrl('/gqrx/frequency');
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const setFrequency = async (hz) => {
  const url = utils.makeUrl('/gqrx/frequency');
  try {
    const res = await axios.post(url, { hz });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const getMode = async () => {
  const url = utils.makeUrl('/gqrx/mode');
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const setMode = async (mode, passband_hz) => {
  const url = utils.makeUrl('/gqrx/mode');
  try {
    const res = await axios.post(url, { mode, passband_hz });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const getDspState = async () => {
  const url = utils.makeUrl('/gqrx/dsp');
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const setDspState = async (flag) => {
  const url = utils.makeUrl('/gqrx/dsp');
  try {
    const res = await axios.post(url, { flag });
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const startRecording = async () => {
  const url = utils.makeUrl('/gqrx/record/start');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

const stopRecording = async () => {
  const url = utils.makeUrl('/gqrx/record/stop');
  try {
    const res = await axios.post(url, {});
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

module.exports = {
  connect,
  close,
  getFrequency,
  setFrequency,
  getMode,
  setMode,
  getDspState,
  setDspState,
  startRecording,
  stopRecording
};
