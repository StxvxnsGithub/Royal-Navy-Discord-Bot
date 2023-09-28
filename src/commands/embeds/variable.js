const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
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
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setDescription("Adds an image.")
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
        const image = interaction.options.getAttachment("image") ?? "";
        const hasTimestamp =
            interaction.options.getBoolean("timestamp") ?? false;

        const embedMessage = new EmbedBuilder();

        try {
            if (color) {
                embedMessage.setColor(colorMap.get(color));
            }

            if (title && url) {
                embedMessage.setTitle(title);
                if (
                    url.substring(0, 8) === "https://" ||
                    url.substring(0, 7) === "http://"
                ) {
                    embedMessage.setURL(url);
                } else {
                    await interaction.editReply(
                        `Invalid URL provided. Try again.`
                    );
                    console.error(
                        `\nEmbed Command ERROR: invalid url provided.\n`
                    );
                    return;
                }
            } else if (title) {
                embedMessage.setTitle(title);
            }

            if (desc) {
                embedMessage.setDescription(desc);
            }

            if (fieldCount > 0) {
                let fields = [];

                for (let i = 0; i < fieldCount; i++) {
                    let fieldTitleReceived = false;
                    let fieldTitle = "";
                    let fieldText = "";

                    await interaction.followUp(
                        `<@${
                            interaction.user.id
                        }> Provide the title for field ${i + 1}. (skip)`
                    );

                    const collector =
                        interaction.channel.createMessageCollector({
                            time: 60000,
                        });

                    collector.on("collect", async (message) => {
                        if (
                            !message.author.bot &&
                            message.author.id === interaction.user.id
                        ) {
                            if (!fieldTitleReceived) {
                                if (message.content.toLowerCase() !== "skip") {
                                    fieldTitle = message.content;
                                } else {
                                    fieldTitle = " ";
                                }

                                fieldTitleReceived = true;
                                await interaction.followUp(
                                    `<@${
                                        interaction.user.id
                                    }> Provide the text for field ${
                                        i + 1
                                    }. (skip)`
                                );
                            } else {
                                if (message.content.toLowerCase() !== "skip") {
                                    fieldText = message.content;
                                } else {
                                    fieldText = " ";
                                }

                                collector.stop();
                            }
                        }
                    });

                    while (!collector.checkEnd()) {
                        await wait(1000);
                    }

                    if (fieldTitle && fieldText) {
                        fields = fields.concat(
                            splitFieldLines(fieldTitle, fieldText)
                        );
                    }
                }

                embedMessage.addFields(fields);
            }

            if (image && image.url) {
                const extension = image.url
                    .split(".")
                    .pop()
                    .split("?")
                    .shift()
                    .toLowerCase();

                if (
                    extension === "png" ||
                    extension === "jpg" ||
                    extension === "jpeg" ||
                    extension === "gif"
                ) {
                    embedMessage.setImage(image.url);
                } else {
                    await interaction.editReply(
                        `Unsupported file type provided. Try again.`
                    );
                    console.error(
                        `\nEmbed Command ERROR: Unsupported file type provided.\n`
                    );
                    return;
                }
            }

            if (hasTimestamp) {
                embedMessage.setTimestamp();
            }
        } catch (error) {
            await interaction.editReply(`Failed to construct the embed.`);
            console.error(
                `\nEmbed Command ERROR: embed construction fail. \n${error}\n`
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
                    `\nEmbed Command ERROR: message send fail. \n${error}\n`
                );
            });

        if (sentEmbed) {
            console.log(`Embed Command: message send success.`);
            await interaction.editReply(
                `Embed Sent: [View](https://discord.com/channels/${sentEmbed.guild.id}/${sentEmbed.channel.id}/${sentEmbed.id})`
            );
        }
    },
};
