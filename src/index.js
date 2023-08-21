const { Client, Events, GatewayIntentBits } = require("discord.js"); // Requires the necessary discord.js classes
const { token } = require("../config.json"); // Requires the config.json file storing important data

// Instantiates the Client class from discord.js
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
    console.log(`${c.user.tag} is ONLINE.`);
});

client.login(token);
