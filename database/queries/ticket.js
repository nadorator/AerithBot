const TicketSchema = require('../schema/ticket');

const createTicket = async (userId, username, timeStamp,tag) => {
	const query = new TicketSchema({
		user: {
			id: userId,
			username: username,
			joinedAt: timeStamp,
			tag: tag,
		},
	});
	await query.save();
};

module.exports = {
	createTicket,
};