const express = require('express');
const morgan = require('morgan');
const app = express();

const appError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
// app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
	req.requestedAt = new Date().toISOString();
	next();
});

//3.ROUTING

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//unhandled route protection middleware:

app.all('*', (req, res, next) => {
	next(
		new appError(
			`Requested route:${req.originalUrl} cannot be found on this server.`,
			404
		)
	);
});

//ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

module.exports = app;
