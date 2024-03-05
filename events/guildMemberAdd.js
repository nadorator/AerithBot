const { createTicket } = require('../database/queries/ticket');
const { ChannelType } = require('discord.js');

module.exports = async (client, member) => {
	// check if user is a real user then
	if (!member.user.bot && !member.user.system) {
		console.log(member);
		// store user in database
		await createTicket(
			member.user.id,
			member.user.username,
			member.user.createdTimestamp,
			member.user.nickname,
		);

		console.log('ticket created for ' + member.user.username);
		// create new private channel
		// move user to channel with welcome message
		// send pm to receptionists group
		await member.guild.channels.create('ticket-' + member.user.id, {
			// permissionOverwrites: [
			// 	{
			// 		id: everyone.id,
			// 		deny: 'VIEW_CHANNEL',
			// 	}, {
			// 		id: support.id,
			// 		allow: 'VIEW_CHANNEL',
			// 	}, {
			// 		id: message.author.id,
			// 		allow: 'VIEW_CHANNEL',
			// 	},
			// ],
		});
	}
};