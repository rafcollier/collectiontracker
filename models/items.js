let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config/database'); 

let ItemSchema = new Schema({
	
	dateEntered: {
	  type: Date, default: Date.now
	},
	itemUserName: {
	  type: String
	},
	itemBrand: {
	  type: String
	},
	itemModel: {
	  type: String
	},
	itemDescription: {
	  type: String
	},
	itemImageURL: {
	  type: String
	},
	dateLastWorn: {
      type: Date  
	},
	dateWornString: [{
      type: String  
	}],

});

let Item = mongoose.model('Item', ItemSchema)
module.exports = Item;







