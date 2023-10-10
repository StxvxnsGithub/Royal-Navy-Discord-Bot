const fs = require("node:fs"); // Module for using the file system
const path = require("node:path"); // Module for working with file paths

module.exports = () => { // Exports the following code for it to be used externally
    const commands = []; // Creates an array that will hold individual command files
    const commandsFolderPath = path.join(__dirname, "..", "commands"); // Defines the path to find commands (./../commands)
    const commandFolders = fs.readdirSync(commandsFolderPath); // Reads the folder containing individual command folders/categories

    for (const commandFolder of commandFolders) { // Loops through the folders of commands
        const commandPath = path.join(commandsFolderPath, commandFolder); // Creates a path to the command folder
        const commandFiles = fs
            .readdirSync(commandPath) // Reads files in the command folder
            .filter((file) => file.endsWith(".js")); // Only takes .js files

        for (const commandFile of commandFiles) { // Loops through the command files
            const filePath = path.join(commandPath, commandFile); // Creates the path to the command file
            const command = require(filePath); // Loads the exported data from the command file

            if ("data" in command && "execute" in command) { // Checks if the command possesses required components
                commands.push(command); // Adds the command to the array of commmands
            } else {
                console.error(
                    `\nCommand ERROR: ${filePath} is missing data.\n`
                ); // Logs an incomplete command file
            }
        }
    }
    return commands; // Returns the array of commands to where getCommands.js is called
};
