const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory=require('./handllerFactory')


const filterObj=(obj,...allowedFields)=>{
  const newObj={}
    Object.keys(obj).forEach(el=>{
      if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const tours = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }
  // Filtered out unwanted fiels names that are not allowed to be updated
  const filterdBody=filterObj(req.body,'name','email')

  // 3) Update user document

  //body.role:'admin''


  const updateUser = await User.findByIdAndUpdate(req.user.id, filterdBody,{
    
    new: true,
    runValidators:true
  });

  res.status(200).json({
    status: 'success',
    data:{
      user:updateUser
    }
  });
});

exports.deleteMe=catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(204).json({
    status:'success',
    data:null
  })
})
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = factory.deleteOne(User)
