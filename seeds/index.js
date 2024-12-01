const express = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/campgrounds.js");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");
const app = express();
const port = 3000;
const path = require("path");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => console.log("Db connected"))
  .catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "673fa17f7265016d72e48a99",
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla id, sint eum voluptates magni necessitatibus pariatur reprehenderit dicta. Nulla, ipsam suscipit impedit eligendi molestiae ut. Porro saepe illo consectetur velit!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/duza28dny/image/upload/v1732638941/YelpCamp/woussnpozfq0mpcu0pge.jpg",
          filename: "YelpCamp/woussnpozfq0mpcu0pge",
        },
        {
          url: "https://res.cloudinary.com/duza28dny/image/upload/v1732638941/YelpCamp/ez4nk3umpigedi8eyn1o.jpg",
          filename: "YelpCamp/ez4nk3umpigedi8eyn1o",
        },
        {
          url: "https://res.cloudinary.com/duza28dny/image/upload/v1732638941/YelpCamp/kerchmyv8y0oeg2io5dr.webp",
          filename: "YelpCamp/kerchmyv8y0oeg2io5dr",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
