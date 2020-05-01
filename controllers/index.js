const Log = require('../lib/logger');

// @desc    Post Event
// @route   POST api/v1/event
// @access  Public

exports.postEvent = async (req, res, next) => {
	try {
		Log.info(`app.server.post.event.message.request ${req.method} ${req.originalUrl}`);

		res.status(200).json({ success: true });
		Log.info(`app.server.post.event.message.response ${req.method} ${req.originalUrl} 200`);
	} catch (err) {
		Log.error(`app.server.post.event.message.response ${req.method} ${req.originalUrl} 400 ${err}`);
		res.status(400).json({
			success: false,
			error: err,
		});
	}
};
