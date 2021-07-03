const mongoose = require('mongoose');

require('dotenv').config({
	path: './config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	// .connect(process.env.DATABASE_LOCAL, {
	//Connecting with local DB and not hosted
	.connect(DB, {
		//Connecting using hosted DB
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true, //Verify that is needed
	})
	.then(() => console.log('DB connection successfully'));

// console.log(process.env);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`App is running on port ${port}`);
});
