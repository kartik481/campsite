const mongoose = require('mongoose');
const review = require('./review');

const imageSchema = new mongoose.Schema({

    url: String,
    filename: String,

});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON:{virtuals:true}}
const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, coordinates: {
            type: [Number],
            required: true
        }
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: [imageSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'

    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/camps/${this._id}">${this.name}</a>`
})


CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if (camp) {
        await review.deleteMany({
            _id: {
                $in: camp.reviews
            }
        })
    }
})

module.exports = mongoose.model('CampgroundSchema', CampgroundSchema);