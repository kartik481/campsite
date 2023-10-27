const campGround = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary');
const mapsToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: mapsToken })

module.exports.index = async (req, res) => {
    const camps = await campGround.find({})
    res.render('Camps/campIndex', { camps, title:"Camps" })
}

module.exports.makeCamp = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode(
        {
            query: req.body.camp.location,
            limit: 1
        }
    ).send()

    const newCamp = new campGround(req.body.camp);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCamp.owner = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully created a camp site!');
    res.redirect(`/camps/${newCamp._id}`)
}

module.exports.viewMakeCamp = async (req, res) => {
    res.render('Camps/newcamp',  {title:"New Campsite"});
}

module.exports.showCamp = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campGround.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'

        }
    }).populate('owner');
    if (!camp) {
        req.flash('error', "Camp site is not found");
        res.redirect('/camps')
    }
    res.render('Camps/show', { camp, title:`${camp.name}` });
}

module.exports.updateCamp = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode(
        {
            query: req.body.camp.location,
            limit: 1
        }
    ).send()
    const { id } = req.params;
    const camp = await campGround.findByIdAndUpdate(id, { ...req.body.camp });
    camp.geometry = geoData.body.features[0].geometry;
    if (req.files) {
        const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
        camp.image.push(...img);
        await camp.save();
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Updated the camp!')
    res.redirect(`/camps/${camp._id}`);
}

module.exports.destroyCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await campGround.findById(id);
    for (let filename of camp.image) {
        await cloudinary.uploader.destroy(filename);
    }
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Deleted the camp!')
    res.redirect('/camps')
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const c = await campGround.findById(id);
    res.render('Camps/edit', { camp: c, title:`Editing ${c.name}` });
}

module.exports.Search = async(req, res)=>{
    const {name} = req.body;
    const camp = await campGround.findOne({name});
    if(camp){
        req.flash('success', "Found a matching camp in database");
        res.redirect(`/camps/${camp._id}`)
    }
    else{
        req.flash('error', `Sorry cannot find ${name} in the database`);
        res.redirect('/camps');
     }
}