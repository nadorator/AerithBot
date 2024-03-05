const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

dotenv.config();
// Create a new client instance 70368744177655
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
async function init() {

	client.commands = new Collection();
	client.events = new Collection();

	// Connect to MongoDB
	console.log('Connecting to ' + process.env.MONGO_URI);
	await mongoose
		.connect(process.env.MONGO_URI, {})
		.then(() => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log('Error connecting to MongoDB', {
				error: err.message || null,
				stack: err.stack || null,
			});

			process.exit(1);
		});

	const commandFoldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(commandFoldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(commandFoldersPath, folder);
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
	}

	const eventFoldersPath = path.join(__dirname, 'events');
	const eventFolders = fs.readdirSync(eventFoldersPath);

	for (const file of eventFolders) {
		const event = require(__dirname + `/events/${file}`);
		const eventName = file.split('.')[0];
		client.events.set(eventName, event);
		client.on(eventName, event.bind(null, client));
		console.log(`Loaded event ${eventName}`);
	}

	// When the client is ready, run this code (only once).
	// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
	// It makes some properties non-nullable.
	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	// Log in to Discord with your client's token
	client.login(process.env.DISCORD_TOKEN);
}

init();