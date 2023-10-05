const axios = require('axios');
const utils = require('./utils');

const pm2List = async () => {
  const url = utils.makeUrl('/pm/pm2/list');
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

module.exports = {
  pm2List
};
