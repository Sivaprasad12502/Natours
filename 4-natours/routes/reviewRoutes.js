const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({mergeParams:true});

//POST /tour/234fad4/reviews
//POST /tour/234fad4/reviews
//POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restictTo('user'),
    reviewController.createReview,
  );



router.route('/:id').delete(reviewController.deleteReview)

module.exports = router;
