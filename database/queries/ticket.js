const TicketSchema = require('../schema/ticket');

const createTicket = async (userId, username, timeStamp) => {
	const query = new TicketSchema({
		user: {
			id: userId,
			username: username,
			joinedAt: timeStamp,
		},
	});
	await query.save();
};

module.exports = {
	createTicket,
};