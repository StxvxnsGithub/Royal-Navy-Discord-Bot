const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Requires the necessary discord.js classes
const { token } = require("../config.json"); // Requires the config.json file storing important data

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const filePath = path.join(commandsPath, commandFile);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`Command ERROR: ${filePath} is missing data.`);
        }
    }
}

client.once(Events.ClientReady, (c) => {
    console.log(`${c.user.tag} is ONLINE.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `Command Fetch ERROR: ${interaction.commandName} was not found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Command Execution ERROR: ${error}`);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content:
                    "An error occured while attempting to execute this command.",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content:
                    "An error occured while attempting to execute this command.",
                ephemeral: true,
            });
        }
    }
});

client.login(token);
