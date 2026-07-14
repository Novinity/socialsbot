import { config as configDotenv } from "dotenv";
import { REST, Routes } from "discord.js";
const fs = require("fs");
const path = require("path");

configDotenv();

const commands = [];

// Register commands

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
            if (command.data.name === "template") continue;
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Register a REST object
const rest = new REST().setToken(process.env.BOT_TOKEN as string);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        // Send the command data to Discord
        const data = (await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: commands })) as unknown[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();