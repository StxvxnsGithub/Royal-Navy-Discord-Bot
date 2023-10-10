const fs = require("node:fs"); // Module for using the file system
const path = require("node:path"); // Module for working with file paths

module.exports = () => { // Exports the following code for it to be used externally
    const commands = []; // Creates an array that will hold individual command files
    const commandsFolderPath = path.join(__dirname, "..", "commands"); // Defines the path to find commands (./../commands)
    const commandFolders = fs.readdirSync(commandsFolderPath); // Reads the folder containing individual command folders/categories

    for (const commandFolder of commandFolders) { // Loops through the commands
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
