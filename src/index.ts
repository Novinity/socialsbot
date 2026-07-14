import { config as configDotenv } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./loaders/commandLoader";
import { loadEvents } from "./loaders/eventLoader";
import { neon } from "@neondatabase/serverless";
configDotenv();

// Create the discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

const sql = neon(process.env.DATABASE_URL as string);

client.commands = new Collection();
client.configs = new Collection();
client.sql = sql;

// Load core features
loadCommands(client);
loadEvents(client);

// Start services
// startTemplateService(client);

// Connect to Discord and bring the bot online
client.login(process.env.BOT_TOKEN);