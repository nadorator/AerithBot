const { createTicket } = require('../database/queries/ticket');

module.exports = async (client, member) => {
	console.log(member);
			await createTicket(
				member.user.id,
				member.user.username,
				member.user.createdTimestamp,
				member.user.tag,
			);
	console.log('ticket created for ' + member.user.username);	
	}
};