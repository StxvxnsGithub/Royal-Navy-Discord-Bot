const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");

const allowedUsers = ["188577632760102912" /*onlyfeds*/];
const allowedRoles = ["1143582433556574271" /*FDS Test Role*/];
const colors = {
    navyBlue: 0x040c43,
    red: 0xd42145,
    white: 0xffffff,
};
const colorMap = new Map(Object.entries(colors));

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
                .setName("colour")
                .setDescription("Sets the embed colour.")
                .setRequired(false)
                .addChoices(
                    { name: "Navy Blue", value: "navyBlue" },
                    { name: "Red", value: "red" },
                    { name: "White", value: "white" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("title")
                .setDescription("Adds a title.")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setDescription("Adds a link to the title.")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("desc")
                .setDescription("Adds a description to the title.")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("field-title")
                .setDescription("Adds a title to a field.")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("field-text")
                .setDescription("Adds text to a field.")
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        // Checks if the user is whitelisted or has a whitelisted role
        if (
            !(
                interaction.member.roles.cache.some((role) =>
                    allowedRoles.includes(role.id)
                ) || allowedUsers.includes(interaction.member.id)
            )
        ) {
            await interaction.editReply(
                "You are not authorised to use this command."
            );
            return;
        }
        // await interaction.reply("Creating your embed message...");

        const channel = interaction.options.getChannel("channel");

        // Information used to create an embed
        const color = interaction.options.getString("colour") ?? "";
        const title = interaction.options.getString("title") ?? "";
        const url = interaction.options.getString("url") ?? "";
        const desc = interaction.options.getString("desc") ?? "";
        const fieldTitle = interaction.options.getString("field-title") ?? "";
        const fieldText = interaction.options.getString("field-text") ?? "";

        const embedMessage = new EmbedBuilder();

        if (color) {
            embedMessage.setColor(colorMap.get(color));
        }

        if (title && url) {
            embedMessage.setTitle(title);
            embedMessage.setURL(url);
        } else if (title) {
            embedMessage.setTitle(title);
        }

        if (desc) {
            embedMessage.setDescription(desc);
        }

        console.log(fieldText);
        console.log(`Test: ${fieldText}`);

        if (fieldTitle && fieldText) {
            const fieldTextLines = fieldText.replace(/\\n/g, "\n").split("\n");

            const embedFields = [];

            embedFields.push({ name: fieldTitle, value: fieldTextLines[0] });
            for (let i = 1; i < fieldTextLines.length; i++) {
                embedFields.push({ name: " ", value: "\n" });
                embedFields.push({ name: " ", value: fieldTextLines[i] });
            }

            console.log(embedFields);
            embedMessage.addFields(embedFields);
        } else if (fieldTitle) {
            embedMessage.addFields({ name: fieldTitle, value: " " });
        } else if (fieldText) {
            embedMessage.addFields({ name: " ", value: fieldTextLines[0] });
        }

        // Sends the completed embed message
        const sentEmbed = await channel
            .send({ embeds: [embedMessage] })
            .catch((error) => {
                interaction.editReply(
                    `Embed ERROR: insufficient information provided.`
                );
                console.error(
                    `Embed Command ERROR: message send fail. \n${error}`
                );
                return;
            });

        console.log(`Embed Command: message sent successfully.`);
        interaction.editReply(
            `Embed Sent: [View](https://discord.com/channels/${sentEmbed.guild.id}/${sentEmbed.channel.id}/${sentEmbed.id})`
        );
    },
};
