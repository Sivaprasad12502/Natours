const fs=require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../../models/tourModels')
const Review=require('./../../../models/reviewModel')
const User=require('./../../../models/userModel')
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// REAd json file
const tours= JSON.parse(fs.readFileSync(`./starter/dev-data/data/tours.json`,'utf-8'))
const users= JSON.parse(fs.readFileSync(`./starter/dev-data/data/users.json`,'utf-8'))
const reviews= JSON.parse(fs.readFileSync(`./starter/dev-data/data/reviews.json`,'utf-8'))

/// import data inot db

const importData=async ()=>{
    try{
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(reviews)
        console.log('Data successfully loaded')
    }catch(err){
        console.log(err)
    }
    process.exit()

}

// delet all data from db

const deleteData=async ()=>{
    try{
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data successfully deleted')
    }catch(err){
        console.log(err)
    }
    process.exit();

}


if(process.argv[2]==='--import'){
    importData()
}else if (process.argv[2]==='--delete'){
    deleteData()
}

