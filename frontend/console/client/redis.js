const { createClient } = require('redis');

let client, pubsub;

let clientFailure = false;
let pubsubFailure = false;

let clientInitialized = false;
let pubsubInitialized = false;

const initialize = async () => {
  client = await createClient()
    .on('error', err => {
      clientFailure = true;
    })
    .connect();

  if (clientFailure) {
    return;
  }
  clientInitialized = true;

  pubsub = client.duplicate();
  pubsub.on('error', err => {
    pubsubFailure = true;
  });
  await pubsub.connect();

  if (pubsubFailure) {
    return;
  }
  pubsubInitialized = true;
};

const getClient = () => {
  if (!clientInitialized || clientFailure) {
    throw new Error('redis client not initialized');
  }
  return client;
};

const getPubsub = () => {
  if (!pubsubInitialized || pubsubFailure) {
    throw new Error('redis pubsub client not initialized');
  }
  return pubsub;
};

module.exports = {
  initialize,
  getClient,
  getPubsub
};
