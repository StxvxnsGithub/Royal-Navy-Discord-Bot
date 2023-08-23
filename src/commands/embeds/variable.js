const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const splitFieldLines = require("../../utils/splitFieldLines");

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
        .setName("variable-embed")
        .setDescription("Creates an embed message (title, desc, field).")
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
        .addIntegerOption((option) =>
            option
                .setName("fields")
                .setDescription("Number of fields.")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("timestamp")
                .setDescription("Adds a timestamp.")
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
        const fieldCount = interaction.options.getInteger("fields") ?? 0;
        const hasTimestamp =
            interaction.options.getBoolean("timestamp") ?? false;

        const embedMessage = new EmbedBuilder();

        try {
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

            // if (fieldTitle && fieldText) {
            //     const embedFields = splitFieldLines(fieldTitle, fieldText);

            //     embedMessage.addFields(embedFields);
            // } else if (fieldTitle) {
            //     embedMessage.addFields({ name: fieldTitle, value: " " });
            // } else if (fieldText) {
            //     embedMessage.addFields({ name: " ", value: fieldTextLines[0] });
            // }

            for (let i = 0; i < fieldCount; i++) {
                console.log(1);
            }

            if (hasTimestamp) {
                embedMessage.setTimestamp();
            }
        } catch (error) {
            interaction.editReply(`Failed to construct the embed.`);
            console.error(
                `\nEmbed Command ERROR: embed construction fail. \n${error}`
            );
            return;
        }

        // Sends the completed embed message
        const sentEmbed = await channel
            .send({ embeds: [embedMessage] })
            .catch((error) => {
                interaction.editReply(
                    `Aborted. Insufficient information provided.`
                );
                console.error(
                    `\nEmbed Command ERROR: message send fail. \n${error}`
                );
                return;
            });

        console.log(`Embed Command: message sent successfully.`);
        interaction.editReply(
            `Embed Sent: [View](https://discord.com/channels/${sentEmbed.guild.id}/${sentEmbed.channel.id}/${sentEmbed.id})`
        );
    },
};
