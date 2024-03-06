const { PermissionsBitField, ChannelType, SlashCommandBuilder } = require('discord.js');
const { createTicket } = require('../../database/queries/ticket');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('simul')
		.setDescription('Simulate new user joining.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		console.log(interaction.member);
		await createTicket(
			interaction.member.user.id,
			interaction.member.user.username,
			interaction.member.user.createdTimestamp,
			interaction.member.nickname,
		);
		console.log('ticket created for ' + interaction.member.user.username);
		// check if receptionist role exists
		const receptionistRole = await interaction.member.guild.roles.cache.find(role => role.name === 'receptionist');
		if (receptionistRole === undefined) {
			await interaction.member.guild.roles.create({
				name:'receptionist',
			});
		}

		// create new private channel
		console.log(interaction.member.guild);
		await interaction.member.guild.channels.create({
			name:'ticket-' + interaction.member.user.username,
			type: ChannelType.GuildText,
			permissionOverwrites: [
				{
					id: interaction.member.guild.roles.everyone.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: interaction.member.guild.roles.cache.find(role => role.name === 'receptionist').id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
			],
		});
		// send welcome message to user in the created channel
		const channel = await interaction.member.guild.channels.cache.find(channelItem => channelItem.name === 'ticket-' + interaction.member.user.username);
		if (channel !== undefined) {
			channel.send('Bienvenue sur ' + interaction.member.guild.name + ' ' + interaction.member.nickname);
		}

		// send pm to receptionists group

		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};