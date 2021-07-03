const Tour = require('../models/tourModel');
const apiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
	const features = new apiFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	//EXECUTE QUERY
	const tours = await features.query;

	//SEND RESPONSE
	res.status(200).json({
		status: 'success',
		// requestedAt: req.requestedAt,
		results: tours.length,
		data: { tours },
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tourId = req.params.id;
	const tour = await Tour.findById(tourId);
	if (!tour) return next(new appError('Invalid tour ID', 404));

	//findById === Tour.findOne({_id:req.params.id})
	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

exports.createTour = catchAsync(async (req, res, next) => {
	// const newTour = new Tour({})
	// newTour.save()

	const tour = await Tour.create(req.body);

	if (!tour) return next(new appError('Invalid tour ID', 404));

	res.status(201).json({
		status: 'success',
		data: { tour },
	});
});

exports.deleteTour = catchAsync(async (req, res, next) => {
	const tourId = req.params.id;
	const tour = await Tour.findByIdAndDelete(tourId);

	if (!tour) return next(new appError('Invalid tour ID', 404));

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.updateTour = catchAsync(async (req, res, next) => {
	const tourId = req.params.id;
	const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedTour) return next(new appError('Invalid tour ID', 404));

	res.status(201).json({
		status: 'success',
		data: { updatedTour },
	});
});

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 1 } },
		},
		{
			$group: {
				_id: '$difficulty',
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{
			$sort: { avgPrice: -1 },
		},
	]);
	res.status(201).json({
		status: 'success',
		data: { stats },
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = +req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates',
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTourStarts: { $sum: 1 },
				tourNames: { $push: '$name' },
			},
		},
		{
			$addFields: { month: '$_id' },
		},
		{
			$project: { _id: 0 },
		},
		{
			$sort: { numTourStarts: -1 },
		},
	]);
	res.status(201).json({
		status: 'success',
		data: { plan },
	});
});
