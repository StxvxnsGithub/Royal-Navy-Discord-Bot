// An executable js file used to deploy commands to the test server

const getCommands = require("../utils/getCommands");
const { REST, Routes } = require("discord.js"); // Requires the necessary discord.js classes
const { token, clientID, testGuildID } = require("../../config.json"); // Requires the config.json file storing important data

const commands = getCommands().map((command) => {
    return command.data.toJSON();
});

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(
            `Deploying ${commands.length} application commands for testing...`
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(clientID, testGuildID),
            { body: commands }
        );

        console.log(
            `Deployed ${data.length} application commands for testing.`
        );
    } catch (error) {
        console.error(`\nCommand Deployment ERROR: \n${error}\n`);
    }
})();
