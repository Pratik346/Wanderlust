const mongoose= require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
const initdb=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"69034394b21cf4a4275bb4e5"}));
    await listing.insertMany(initdata.data);
    console.log("Saved to Database");
}
initdb();