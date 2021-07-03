const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			maxLength: [40, "A tour's name must have up to 40 characters"],
			minLength: [5, "A tour's name must have more than 5 characters"],
			// validate: [validator.isAlpha, 'Tour name must contain only characters'],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, 'A tour must have a duration'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a maximum group size'],
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a maximum difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: ['Difficultly has to be either easy/medium or difficult '],
			},
		},
		ratingsAverage: {
			type: Number,
			min: [1, 'Rating must exceed 1.0'],
			max: [5, 'Rating must be lower than 5.0'],
			// default: 0,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
			default: 1,
		},
		priceDiscount: {
			type: Number,
			validate: {
				// this only points to the current doc when creating a new one and not when updating existing one.
				validator: function (val) {
					return val < this.price;
				},
				message: 'Discount price ({VALUE}) should be lower than regular price',
			},
		},
		summary: {
			type: String,
			required: [true, 'A tour must have a summary'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'A tour must have a description'],
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a cover image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		secretTour: {
			type: Boolean,
			default: false,
		},
		startDates: [Date],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
	// this.slug = slugify(this.name, { lower: true });
	// this.slug = this.name.toLowerCase().split(' ').join('-');
	this.slug = this.name.toLowerCase().replace(/\s/g, '-');
	next();
});

// tourSchema.post('save', function (doc, next) {
// 	console.log(doc);
// 	next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });

	this.start = Date.now();
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query took:  ${Date.now() - this.start}ms`);
	next();
});

//AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	// console.log(this.pipeline());
	next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
