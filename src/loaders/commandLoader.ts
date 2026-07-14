import { Client } from "discord.js";
const fs = require("fs");
const path = require("path");

// Register all commands
export function loadCommands(client: Client) {
    // Get the command folders
    const foldersPath = path.join(__dirname, "../commands");
    const commandsFolder = fs.readdirSync(foldersPath);

    for (const folder of commandsFolder) {
        const commandsPath = path.join(foldersPath, folder);
        // Ensure we aren't about to treat a command file as a directory
        if (!fs.lstatSync(commandsPath).isDirectory()) continue;

        // Get all the files in the current subdirectory
        const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            // Ensure it has the correct info, then register it
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}