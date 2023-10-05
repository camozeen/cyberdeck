const axios = require('axios');
const utils = require('./utils');

const docBySlug = async (slug) => {
  const url = utils.makeUrl(`/docs/${slug}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    utils.handleHttpError(e, url);
  }
};

module.exports = {
  docBySlug
};
