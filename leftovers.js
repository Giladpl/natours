//2.ROUTE HANDLERS/CONTROLLERS

// exports.verifyId = (req, res, next, val) => {
// 	const id = +req.params.id;
// 	const tour = tours.find((tour) => tour.id === id);
// 	if (!tour) {
// 		return res.status(404).json({
// 			status: 'failed',
// 			message: 'Invalid ID',
// 		});
// 	}
// 	next();
// };

// exports.verifyBody = (req, res, next) => {
// 	const item = req.body;
// 	if (!item.name || !item.price) {
// 		return res.status(400).json({
// 			status: 'failed',
// 			message: 'Missing name or price',
// 		});
// 	}
// 	next();
// };

exports.getAllTours = async (req, res) => {
	try {
		//BUILD QUERY

		// //1A. Filtering
		// const queryObj = { ...req.query };
		// const excludedFields = ['page', 'sort', 'limit', 'fields'];
		// excludedFields.forEach((el) => delete queryObj[el]);
		// // excludedFields.forEach((el) => ({ [el]: removed, ...query } = query));

		// //1B. ADVANCED FILTERING

		// let queryStr = JSON.stringify(queryObj);
		// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		// // const tours = Tour.find()
		// // 	.where('duration')
		// // 	.equals(5)
		// // 	.where('difficulty')
		// // 	.equals('easy');

		// let query = Tour.find(JSON.parse(queryStr));

		//2.SORTING

		// if (req.query.sort) {
		// 	const sortBy = req.query.sort.split(',').join(' ');
		// 	query = query.sort(sortBy);
		// } else query.sort('-createdAt');

		// //3.FIELD LIMITING
		// if (req.query.fields) {
		// 	const fields = req.query.fields.split(',').join(' ');
		// 	query = query.select(fields);
		// } else query = query.select('-__v');

		//4.PAGINATION
		// const page = +req.query.page || 1;
		// const limit = +req.query.limit || 100;
		// const skip = (page - 1) * limit;

		// query = query.skip(skip).limit(limit);

		// if (req.query.page) {
		// 	const numTours = await Tour.countDocuments();
		// 	if (skip >= numTours) throw new Error('Page does not exist');
		// }

		//EXECUTE QUERY
		const tours = await query;

		//SEND RESPONSE
		res.status(200).json({
			status: 'success',
			// requestedAt: req.requestedAt,
			results: tours.length,
			data: { tours },
		});
	} catch (error) {
		res.status(404).json({
			status: 'failed',
			message: error,
		});
	}
};
