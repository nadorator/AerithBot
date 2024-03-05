const { createTicket } = require('../database/queries/ticket');

module.exports = async (client, message) => {
	if (message.type === 'GUILD_MEMBER_JOIN') {
		if (message.author.verified && !message.bot) {
			await createTicket(
				message.author.id,
				message.author.username,
				message.createdTimestamp,
			);
			console.log('ticket created for ' + message.author.username);
			message.react('welcome ' + message.author.username);
		}
	}
};