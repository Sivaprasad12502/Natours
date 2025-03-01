const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handllerFactory');

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createReview=catchAsync(async(req,res,next)=>{

//     const newReview=await Review.create(req.body)

//     res.status(201).json({
//         status:'sucess',
//         data:{
//             review:newReview
//         }
//     })
// })

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
