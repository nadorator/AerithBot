const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Ticket',
	new mongoose.Schema({
		createdAt: { type: Number, default: Date.now() },

		user: {
			id: { type: String },
			username: { type: String },
			joinedAt: { type: Number, default: -1 },
		},
	}),
	'AerithBot',
);