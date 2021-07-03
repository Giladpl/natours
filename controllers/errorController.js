const appError = require('../utils/appError');

const handleCastErrorDb = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new appError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	//Operational trusted error- send to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			// error: err,
			// stack: err.stack,
		});
	} else {
		//Other uncontrolled- programming/3rd party errors. Min details to client
		console.error('ERROR- ', err);
		res.status(500).json({
			status: 'error',
			message: 'something went wrong',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		// const error = {...err, name: err.name};
		// if (err.name === 'CastError') {
		// 	err = handleCastErrorDb(err);
		// }
		sendErrorProd(err, res);
	}
};
