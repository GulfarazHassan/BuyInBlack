const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, '_id is required'],
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  location_enabled: {
    type: Boolean,
    default: false,
  },
  date_added: {
    type: Date,
    default: new Date(),
  },
  favorites: [{
    type: mongoose.Types.ObjectId,
    ref: 'Business',
  }],
  app_alerts: {
    review_us: {
      rating: {
        type: Number,
        default: 0
      },
      comment: {
        type: String,
        default: ""
      },
      reviewed_app: {
        type: Boolean,
        default: false
      },
      not_now: {
        type: Boolean,
        default: false
      },
    },
    feedback: {
      rating: {
        type: Number,
        default: 0
      },
      reason: {
        type: String,
        default: ""
      },
      suggestion: {
        type: String,
        default: ""
      },
      email: {
        type: String,
        default: ""
      },
      not_now: {
        type: Boolean,
        default: false
      },
    }
  },
  push_notifications: [
    {
      is_viewed: {
        type: Boolean,
        default: false
      },
      business_name: {
        type: String,
        default: ""
      },
      call_to_action: {
        action_text: {
          type: String,
          default: ""
        },
        hyperlink: {
          type: String,
          default: ""
        }
      }
      ,
      category: {
        type: String,
        default: ""
      },
      click_count: {
        type: Number,
        default: 0
      },
      message_image: {
        type: String,
        default: ""
      },
      message_push: {
        type: String,
        default: ""
      },
      message_title: {
        type: String,
        default: ""
      },
      scheduled_date: {
        type: String,
        default: ""
      },
      scheduled_time: {
        type: String,
        default: ""
      },
      sent_status: {
        type: String,
        default: ""
      },
      time_zone: {
        type: String,
        default: ""
      },
      zip_code: {
        type: String,
        default: ""
      }
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
