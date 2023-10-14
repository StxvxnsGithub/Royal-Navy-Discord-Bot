const fs = require("node:fs"); // Module for using the file system
const path = require("node:path"); // Module for working with file paths
const getCommands = require("./utils/getCommands"); // Imports the getCommands function
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Requires the necessary discord.js classes
const { token } = require("../config.json"); // Requires the config.json file storing important data

const client = new Client({ // Initialises an instance of the client class, enabling intents
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection(); // Creates a collection to store the bot's commands

getCommands().forEach((command) => { // Retrieves each command
    client.commands.set(command.data.name, command); // Adds each command to the commands collection
});

const eventsFolderPath = path.join(__dirname, "events"); // Creates a path to the events folder
const eventFiles = fs
    .readdirSync(eventsFolderPath) // Reads files in the events folder
    .filter((file) => file.endsWith(".js")); // Only obtains the .js files

for (const eventFile of eventFiles) { // Loops through the files of events
    const filePath = path.join(eventsFolderPath, eventFile); // Creates a path to the event file
    const event = require(filePath); // Imports the function within the event file

    // Checks if the event should only be ran once
    if (event.once) { 
        client.once(event.name, (...args) => event.execute(...args)); // If one-time event, creates a one-time listener
    } else {
        client.on(event.name, (...args) => event.execute(...args)); // Else, creates a standard event listener
    }
}

client.login(token); // Logs into and starts the bot
