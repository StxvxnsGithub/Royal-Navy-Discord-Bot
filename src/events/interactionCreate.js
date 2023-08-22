const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(`${interaction.commandName} Fetch ERROR: not found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(
                `${interaction.commandName} Execution ERROR: ${error}`
            );

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `An error occured while attempting to execute this command.`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `An error occured while attempting to execute this command.`,
                    ephemeral: true,
                });
            }
        }
    },
};
