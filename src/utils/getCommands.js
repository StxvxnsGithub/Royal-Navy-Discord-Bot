const fs = require("node:fs");
const path = require("node:path");

module.exports = () => {
    const commands = [];
    const commandsFolderPath = path.join(__dirname, "..", "commands");
    const commandFolders = fs.readdirSync(commandsFolderPath);

    for (const commandFolder of commandFolders) {
        const commandPath = path.join(commandsFolderPath, commandFolder);
        const commandFiles = fs
            .readdirSync(commandPath)
            .filter((file) => file.endsWith(".js"));

        for (const commandFile of commandFiles) {
            const filePath = path.join(commandPath, commandFile);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {
                commands.push(command);
            } else {
                console.error(
                    `\nCommand ERROR: ${filePath} is missing data.\n`
                );
            }
        }
    }
    return commands;
};
