const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Item = require('../models/items');

router.post('/items', (req, res, next) => {

  console.log(req.body.itemUserName);

  let newItem = new Item({
  	itemBrand: req.body.itemBrand,
    itemModel: req.body.itemModel,
    itemDescription: req.body.itemDescription,
    itemImageURL: req.body.itemImageURL,
    itemUserName: req.body.itemUserName
  });

  console.log(newItem);

  newItem.save((err) => {
    if(err) throw err;

    res.json({success: true, msg: 'Item added'});

  });

});

router.get('/getAllItems', (req, res, next) => {
  const offset = req.query.itemOffset;
  Item.find({'itemUserName' : req.query.itemUserName}, null, {skip: Number(offset), limit: 15, sort: req.query.searchParameter }, (err, items) => {
    if (err) throw err;

    res.json(items);
  });
});

router.get('/getOneItem', (req, res, next) => {
  Item.findById(req.query.itemID, (err, item) => { 
    if (err) throw err;

    res.json(item);
  });
});

router.delete('/deleteOneItem', (req, res, next) => {
  console.log("In the backend router to delte one item by id");
  console.log(req.query);

  Item.findByIdAndRemove(req.query.itemID, (err, item) => { 
    if (err) throw err;
    
    console.log("Item removed from database");

  });
});

router.put('/updateWornToday', (req, res, next) => {
  console.log("In the backend router to updateWornToday");
  console.log(req.body);
  const query = {_id:req.body.itemID};
  const newWornDate = req.body.wornDate;
  const newWornDateString = req.body.wornDateString;
  Item.findOneAndUpdate(query, {dateLastWorn: newWornDate}, {upsert: true}, (err) => {
    if(err) throw err;

    Item.findOneAndUpdate(query, {$push:{dateWornString: newWornDateString}}, {new: true}, (err) => {
       if(err) throw err;

       res.json({success: true, msg: 'worn today updated'});
    });
  });
});

router.get('/collectionLength', (req, res, next) => {
  Item.count({'itemUserName' : req.query.itemUserName}, function (err, docs) {
      if(err) throw err;

      res.json(docs);
  });
});

module.exports = router;