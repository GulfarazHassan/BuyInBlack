const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'text is required'],
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  date_added: {
    type: Date,
    default: new Date(),
  },
  user: {
    type: String,
    ref: 'User',
  },
});

const Search = mongoose.model('Search', SearchSchema);

module.exports = Search;
