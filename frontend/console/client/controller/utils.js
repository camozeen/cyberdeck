
const handleHttpError = (err, url) => {
  if (err.response) {
    throw new Error(`error: ${url} - ${e.response.status}`);
  }
  throw new Error(`error: ${url} - NO RESPONSE`);
};

const makeUrl = (resource) => {
  const host = process.env.CONTROLLER_HOST;
  const port = process.env.CONTROLLER_PORT;
  const baseUrl = `http://${host}:${port}`;
  return `${baseUrl}${resource}`;
};

module.exports = {
  handleHttpError,
  makeUrl
};
