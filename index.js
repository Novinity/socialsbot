const fs = require('node:fs');
const path = require('node:path');

const discord = require('discord.js');
const keepAlive = require('./server');
require('dotenv').config();

const client = new discord.Client({ intents: [
	discord.GatewayIntentBits.Guilds, 
	discord.GatewayIntentBits.GuildMembers, 
	discord.GatewayIntentBits.GuildMessages,
	discord.GatewayIntentBits.MessageContent
] });

client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(discord.Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	client.user.setActivity("/help");
});

client.on(discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(discord.Events.GuildCreate, async event => {
	const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
		if (err) throw err;
		return data;
	});
	const obj = JSON.parse(fileContents);


	obj.servers[event.id.toString()] = {};

	fs.writeFileSync('config/config.json', JSON.stringify(obj));
});

client.on(discord.Events.GuildDelete, async event => {
	const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
		if (err) throw err;
		return data;
	});
	const obj = JSON.parse(fileContents);

	delete obj.servers[event.id.toString()];

	fs.writeFileSync('config/config.json', JSON.stringify(obj));
});

keepAlive();
client.login(process.env.TOKEN);
