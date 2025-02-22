const fs=require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../../models/tourModels')
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

/// import data inot db

const importData=async ()=>{
    try{
        await Tour.create(tours)
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

