const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js"); // Requires the necessary discord.js classes
const { token, clientID, testGuildID } = require("../../config.json"); // Requires the config.json file storing important data

const commands = [];
const commandsFolderPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(commandsFolderPath);

for (const folder of commandFolders) {
    const commandPath = path.join(commandsFolderPath, folder);
    const commandFiles = fs
        .readdirSync(commandPath)
        .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const filePath = path.join(commandPath, commandFile);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.error(
                `Command Deployment ERROR: ${filePath} is missing data.`
            );
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(
            `Deploying ${commands.length} application commands for testing...`
        );

        const data = await rest.put(Routes.applicationCommands(clientID), {
            body: commands,
        });

        console.log(
            `Deployed ${data.length} application commands for testing.`
        );
    } catch (error) {
        console.error(`Command Deployment ERROR: ${error}`);
    }
})();
