const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  tags: [String],
  email: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  products: [String],
  // This actually means is_online_business.
  web_only: {
    type: Boolean,
    default: false,
  },
  instagram: {
    type: String,
    default: '',
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  date_added: {
    type: Date,
    default: new Date(),
  },
  referral_id: {
    type: String,
    default: '',
  },
  search_rank: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  phone_number: {
    type: String,
    default: '',
  },
  business_name: {
    type: String,
    default: '',
  },
  initial_launch: {
    type: Boolean,
    default: false,
  },
  business_hours: {
    sunday: String,
    monday: String,
    friday: String,
    tuesday: String,
    thursday: String,
    saturday: String,
    wednesday: String,
  },
});

BusinessSchema.index({
  location: '2dsphere',
});

BusinessSchema.index({
  tags: 'text',
  products: 'text',
  business_name: 'text',
});

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;
