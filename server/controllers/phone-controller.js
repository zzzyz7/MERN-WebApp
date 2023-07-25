const Phone = require('../models/phone'); // ../models/phone since not under same directory
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId

//for phone list collection
//add the new phone into database
const createPhone = async (req, res, next) => {
    try {
      const { title, brand, image, stock, seller, price } = req.body;
      const createdPhone = new Phone({
        title: title,
        brand: brand,
        image: image,
        stock: stock,
        seller: seller,
        price: price,
      });
      const result = await createdPhone.save(); //save the data into database, awiat means wait for the code execution done
      console.log(createdPhone._id);
      res.status(201).json(result); //A status code of 201 means that a resource has been successfully created on the server.
    } catch (error) {
      console.error(error);
    }
  };

//get data from the database
const getPhones = async (req, res, next) => {
    try {
      const phones = await Phone.find().exec();
      res.json(phones); //respond to client
    } catch (error) {
      next(error); //pass the error to the error handling middleware
    }
  };

const getPhoneById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const phone = await Phone.findById(id).exec();

    if (phone) {
      res.json(phone);
    } else {
      res.status(404).send("Phone not found");
    }
  } catch (error) {
    next(error);
  }
};

const getSoldOutSoonPhones = async (req, res, next) => {
  try {
    // Find the top 5 phones with the least quantity available (more than 0 quantity and not disabled)
    const SoldOutSoon = await Phone.find({ stock: { $gt: 0 }, disabled: { $exists: false } })
        .sort({ stock: 1 })
        .limit(5)
        .exec();
      res.json(SoldOutSoon); //respond to client
    } catch (error) {
      next(error); //pass the error to the error handling middleware
    }
};

const getBestSellersPhones = async (req, res, next) => {
  try {
    // Find the top 5 phones with the highest average rating (not disabled and at least two ratings given)
    const BestSellers = await Phone.aggregate([
      { $match: { disabled: { $exists: false } } },
      { $unwind: '$reviews' },
      { $group: { _id: '$_id', avgRating: { $avg: '$reviews.rating' } } },
      { $match: { avgRating: { $gte: 2 } } },
      // Add a lookup stage to get the additional details for each phone
      { 
        $lookup: {
          from: "phones", 
          localField: "_id",
          foreignField: "_id",
          as: "phoneDetails"
        }
      },
      { $unwind: "$phoneDetails" },
      { 
        $project: { 
          _id: 1, 
          avgRating: { $round: ["$avgRating", 2] }, //round two decimal place
          image: "$phoneDetails.image", //get the additional details
          title: "$phoneDetails.title",
          price: "$phoneDetails.price",
          seller: "$phoneDetails.seller",
          reviewer: "$phoneDetails.reviews",
          stock: "$phoneDetails.stock"
        }
      },
      { $sort: { avgRating: -1 } }, // from the high to low
      { $limit: 5 },
    ]);
    res.json(BestSellers); //respond to client
  } catch (error) {
    next(error); //pass the error to the error handling middleware
  }
};

const addComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { phoneId, comment, rating, token} = req.body;
    decodedToken = jwt.verify(token, 'secret');
    const userId = decodedToken.userId;
    console.log(`phoneId: ${phoneId}, userId: ${userId}, comment: ${comment}, rating: ${rating}, token: ${token}`);
    let phone;
    try {
      phone = await Phone.findById(phoneId).exec();
      if (!phone) {
        console.log("Phone ", phoneId);
        const error = new HttpError('Could not find phone for provided id', 404);
        return next(error);
      }
      phone.reviews.push({
        reviewer: userId,
        comment: comment,
        rating: rating,
      });
      await phone.save();
      res.json({ message: 'Comment added successfully' });
    } catch (err) {
      console.log(err);
      const error = new HttpError('Fetching phone failed, please try again later', 500);
      return next(error);
    }
};

const getUserListings = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("userId:", userId);
    const phone = await Phone.find({ seller: new ObjectId(userId) });
    console.log(phone);
    const listings = phone.map(phone => ({
      title: phone.title,
      brand: phone.brand,
      image: phone.image,
      stock: phone.stock,
      seller: userId,
      price: phone.price,
    }));
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user listings' });
  }
};

exports.createPhone = createPhone;
exports.getPhones = getPhones;
exports.getPhoneById = getPhoneById;
exports.getSoldOutSoonPhones = getSoldOutSoonPhones;
exports.getBestSellersPhones = getBestSellersPhones;
exports.addComment = addComment;
exports.getUserListings = getUserListings