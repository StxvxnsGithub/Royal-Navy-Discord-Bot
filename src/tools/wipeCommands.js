const { REST, Routes } = require("discord.js");
const { token, clientID, testGuildID } = require("../../config.json");

const rest = new REST({ version: "10" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientID, testGuildID), { body: [] })
    .then(() => console.log(`Deleted all guild commands.'`))
    .catch(console.error);

rest.put(Routes.applicationCommands(clientID), { body: [] })
    .then(() => console.log(`Deleted all application commands,`))
    .catch(console.error);
