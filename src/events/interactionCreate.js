// interactionCreate event is triggered when the user attempts to run an application (/) command.

const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    // Asynchronous call allows for the bot to process multiple events at a time.
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; // Exits out if the received interaction was not a command.

        const command = interaction.client.commands.get(
            interaction.commandName
        ); // Finds the command that the user has attempted.

        if (!command) { // Checks if it's not a commmand.
            console.error(
                `\nCommand Fetch ERROR: ${interaction.commandName} not found.\n`
            ); // Logs that a command could not be found.
            return;
        }

        try { // Attempts to execute the command.
            await command.execute(interaction); // Runs the command's execution, passing the interaction that triggered it.
        } catch (error) { // Catches any errors that took place whilst attempting to execute the command.
            console.error(
                `\nCommand Execution ERROR: ${interaction.commandName}: \n${error}\n`
            ); // Reports the name of the command that caused the error and then what the error is.

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `An error occured while attempting to execute this command.`,
                    // ephemeral: true,
                }); // If the bot has already responded to the user, updates them that there was an error.
            } else {
                await interaction.reply({
                    content: `An error occured while attempting to execute this command.`,
                    ephemeral: true, // Message is only visible to the user.
                }); // If the bot has not responded to the user, makes sure to inform them of the failure.
            }
        }
    },
};
