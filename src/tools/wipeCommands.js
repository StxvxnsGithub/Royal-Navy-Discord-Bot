const { REST, Routes } = require("discord.js");
const { token, clientID, testGuildID } = require("../../config.json");

const rest = new REST({ version: "10" }).setToken(token);

console.log("Deleting application commands...");

rest.put(Routes.applicationGuildCommands(clientID, testGuildID), { body: [] })
    .then(() => console.log(`Deleted all guild commands.`))
    .catch((error) => {
        console.error(
            `\nWipe Commands ERROR: delete guild commands fail. \n${error}\n`
        );
    });

rest.put(Routes.applicationCommands(clientID), { body: [] })
    .then(() => console.log(`Deleted all global commands.`))
    .catch((error) => {
        console.error(
            `\nWipe Commands ERROR: delete global commands fail. \n${error}\n`
        );
    });
