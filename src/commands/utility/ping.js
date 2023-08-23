const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

    async execute(interaction) {
        await interaction.reply("Pong!");

        const collectorFilter = (m) => m.content.includes("discord");
        const collector = interaction.channel.createMessageCollector({
            filter: collectorFilter,
            time: 15000,
        });

        collector.on("collect", (message) => {
            if (
                !message.author.bot &&
                message.author.id === interaction.user.id
            ) {
                console.log(`Collected ${message.content}`);
            }
            collector.stop();
        });

        collector.on("end", (collected) => {
            console.log(`Collected ${collected.size} items`);
        });
    },
};
