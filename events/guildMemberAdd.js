const { createTicket } = require('../database/queries/ticket');
const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = async (client, member) => {
	// check if user is a real user then
	if (!member.user.bot && !member.user.system) {
		console.log(member);
		// store user in database
		await createTicket(
			member.user.id,
			member.user.username,
			member.user.createdTimestamp,
			member.nickname,
		);

		console.log('ticket created for ' + member.user.username);
		// check if receptionist role exists
		const receptionistRole = await member.guild.roles.cache.find(role => role.name === 'receptionist');
		if (receptionistRole === undefined) {
			await member.guild.roles.create({
				name:'receptionist',
			});
		}

		// create new private channel
		console.log(member.guild);
		await member.guild.channels.create({
			name:'ticket-' + member.user.username,
			type: ChannelType.GuildText,
			permissionOverwrites: [
				{
					id: member.guild.roles.everyone.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: member.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: member.guild.roles.cache.find(role => role.name === 'receptionist').id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
			],
		});
		// send welcome message to user in the created channel
		const channel = await member.guild.channels.cache.find(channelItem => channelItem.name === 'ticket-' + member.user.username);
		if (channel !== undefined) {
			channel.send('Bienvenue sur ' + member.guild.name + ' ' + member.nickname);
		}
	}
};