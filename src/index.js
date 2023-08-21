const fs = require("node:fs");
const path = require("node:path");
const getCommands = require("./utils/getCommands");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Requires the necessary discord.js classes
const { token } = require("../config.json"); // Requires the config.json file storing important data

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

getCommands().forEach((command) => {
    client.commands.set(command.data.name, command);
});

const eventsFolderPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsFolderPath)
    .filter((file) => file.endsWith(".js"));

for (const eventFile of eventFiles) {
    const filePath = path.join(eventsFolderPath, eventFile);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
