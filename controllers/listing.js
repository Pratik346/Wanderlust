const listing=require("../models/listing.js")

/*module.exports.index=async(req,res)=>{
    const alllist=await listing.find({});
    res.render("listings/index.ejs",{alllist});
}*/
module.exports.index=async(req,res)=>{
        const {category}=req.query;
        let alllist;
        if(category){
            alllist=await listing.find({category});
        }else{
            alllist=await listing.find({});
        }
        res.render("listings/index",{alllist,category});    
}
module.exports.rendernewform=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showlist=async(req,res)=>{
    let {id}=req.params;
    const pldetails=await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!pldetails){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    console.log(pldetails);
    res.render("listings/show.ejs",{pldetails});
}
module.exports.createnewlist=async(req,res)=>{
    console.log(req.file);
    const newlist=new listing(req.body.listing);
    newlist.owner=req.user._id;
    newlist.image={
        url:req.file.path,
        filename:req.file.filename
    };
    await newlist.save();
    req.flash("Success","New Listing Created!");
    res.redirect("/listings");
}
module.exports.getlisting=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id);
    if(!list){
        res.flash("error","The Listing does not exist!");
    }
    let originalimage=list.image.url;
    let neworiginalimage=originalimage.replace("/upload","/upload/h_250,w_300");
    res.render("listings/edit.ejs",{list,neworiginalimage});
}
module.exports.editlisting=async(req,res)=>{
    let {id}=req.params;
    /*if(!req.body.listing){
        throw new expresserr(400,"Please Fill the Form");
    }*/
    const  list= await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        list.image={
            url:req.file.path,
            filename:req.file.filename
        };
    }
    await list.save();
    req.flash("Success","Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
}
module.exports.destroylisting=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("Success","Listing Deleted!");
    res.redirect("/listings");
}

