import { Client } from "discord.js";
const fs = require("fs");
const path = require("path");

// Register all events
export function loadEvents(client: Client) {
    // Get the event files
    const eventsPath = path.join(__dirname, "../events");
    const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith("ts"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        // Ensure we aren't about to treat a directory as a event file
        if (fs.lstatSync(filePath).isDirectory()) continue;

        // Get the event and register it
        const event = require(filePath)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}