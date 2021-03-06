const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  movie_id: {
    type: Number,
    required: true
  },
  overview: {
    type: String,
    required: true,
    unique: false
  },
  popularity: {
    type: Number,
    required: true,
    default: false
  },
  poster_path: {
    type: String,
    required: false,
    default: null
  },
  title: {
    type: String,
    required: false,
    default: null
  },
  vote_average: {
    type: Number,
    required: false,
    default: null
  },
  vote_count: {
    type: Number,
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Movie', MovieSchema)