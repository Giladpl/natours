const tourController = require('../controllers/tourController');
const express = require('express');
// const { route } = require('../app');
const router = express.Router();

// router.param('id', tourController.verifyId);
router
	.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createTour);
// .post(tourController.verifyBody, tourController.createTour);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
