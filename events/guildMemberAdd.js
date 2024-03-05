const { createTicket } = require('../database/queries/ticket');

module.exports = async (client, member) => {
	console.log(member);
			await createTicket(
				member.id,
				member.username,
				member.createdTimestamp,
			);
	console.log('ticket created for ' + member.username);	
	}
};