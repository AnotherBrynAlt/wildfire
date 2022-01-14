const Discord = require('discord.js-selfbot-v11');
// const _Discord = require('discord.js');
const selfbot = new Discord.Client();
// const client = new _Discord.Client();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const term = 'secret';

const handle = async function handleDeletions(channel, selfID) {
  const messageSearchResults = await channel.search({
    author: selfID,
    contextSize: 0,
    nsfw: true
  });
  if (messageSearchResults.totalResults === 0) return;
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`There are ${messageSearchResults.totalResults} messages remaining remaining.`);
  const deletionSet = messageSearchResults.messages.map(async (resultArray) => {
    const channel = await selfbot.channels.get(resultArray[0].channel.id);
    const message = await channel.messages.get(resultArray[0].id);
    return resultArray[0].delete();
  });
  const task = await Promise.all(deletionSet);
  await handle(channel, selfID);
};

selfbot.on('ready', async () => {
  const channelID = ''; // argv.server;
  const channel = selfbot.channels.get(channelID);
  console.log(channel);
  const selfID = selfbot.user.id; // argv.user;
  const self = selfbot.users.get(selfID);
  console.log(`Logged in on a self bot! This breaks TOS. Only use for proof of concept.`);
  console.log(`Burning Channel: ${channel.id} - ${channel.name}`);
  console.log(`Burning User: ${selfID} - ${self ? self : selfID}`);
  console.log(`Burning Term: ${term}`);
  const messageSearchResults = await channel.search({
    author: selfID,
    contextSize: 0,
    nsfw: true
  });
  console.log(`Found ${messageSearchResults.totalResults} results.`);
  await handle(channel, selfID);
  console.log();
  console.log(`Finished deleting messages from ${self ? self : selfID}`);
  process.exit(0);
});

// client.on('ready', () => {
//  console.log(`Logged in on a real bot for helper functions.`);
// });

// client.login(argv.bot);
selfbot.login("");
