const mongoose = require('mongoose');
const campGround = require('../models/campgrounds');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/campSite',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database Connected!')).catch((err) => {
        console.log("Error", err);
    });


const sample = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];

}

const seedDb = async () => {
    await campGround.deleteMany({});
    for (let i = 0; i <= 100; i++) {
        const random1000 = Math.floor(Math.random() * 500);
        const randprice = Math.floor(Math.random() * 100) + 10;
        const randRating = Math.floor(Math.random() * 5);
        const newCamp = new campGround({
            name: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { 
                type: 'Point', 
                coordinates: [cities[random1000].longitude, cities[random1000].latitude] 
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/dwpxum7yt/image/upload/v1698081708/CampSite/hsiyikr9g2izylpwhdzh.jpg',
                    filename: 'CampSite/hsiyikr9g2izylpwhdzh'
                }
            ],
            price: randprice,
            owner: '653a1d4723dc601d8522594a',
            description: "Nice place to camp!"

        })
        await newCamp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});
