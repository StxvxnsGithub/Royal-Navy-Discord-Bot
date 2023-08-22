const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const allowedUsers = ["188577632760102912" /*onlyfeds*/];
const allowedRoles = ["1143582433556574271" /*FDS Test Role*/];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("basic-embed")
        .setDescription("Creates an embed message.")
        .setDMPermission(false)
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Target Channel.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) =>
            option
                .setName("title")
                .setDescription("Embed Title")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setDescription("Embed Title URL")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("body1")
                .setDescription("Embed Title URL")
                .setRequired(false)
        ),

    async execute(interaction) {
        if (
            interaction.member.roles.cache.some((role) =>
                allowedRoles.includes(role.id)
            )
        ) {
            // await interaction.reply("Creating your embed message...");
            await interaction.deferReply();

            const channel = interaction.options.getChannel("channel");
            const title = interaction.options.getString("title") ?? "";
            const url = interaction.options.getString("url") ?? "";

            const embedMessage = new EmbedBuilder();

            if (title && url) {
                embedMessage.setURL(url);
            } else if (title) {
                embedMessage.setTitle(title);
            }

            // Sends the completed embed message
            channel
                .send({ embeds: [embedMessage] })
                // .send({ content: "test" })
                .then(() => {
                    console.log(`Embed Command: message sent successfully.`);
                    // interaction.reply(
                    //     `Embed sent successfully to #${channel.name}.`
                    // );
                })
                .catch((error) => {
                    interaction.editReply(
                        `Embed ERROR: insufficient information provided.`
                    );
                    console.error(
                        `Embed Command ERROR: message send fail. \n${error}`
                    );
                });
        } else {
        }
    },
};
