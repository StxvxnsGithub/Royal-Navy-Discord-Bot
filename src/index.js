const getCommands = require("./utils/getCommands");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Requires the necessary discord.js classes
const { token } = require("../config.json"); // Requires the config.json file storing important data

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

getCommands().forEach((command) => {
    client.commands.set(command.data.name, command);
});

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
