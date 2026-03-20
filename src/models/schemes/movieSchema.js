import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const movieSchema = new mongoose.Schema({
  releaseDate: {
    type: String,
    required: [true, 'Release date is required'],
    validate: {
      validator: function (v) {
        const date = new Date(v)
        return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(v)
      },
      message: 'Release date must be a valid date in YYYY-MM-DD format'
    }
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  overview: {
    type: String,
    required: [true, 'Overview is required']
  },
  popularity: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  voteAverage: { type: Number, default: 0 },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: [true, 'At least one genre is required'],
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v)
      },
      message: 'Genre must be a valid resource ID'
    }
  }],
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'Language is required'],
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v)
      },
      message: 'Language must be a valid resource ID'
    }
  },
  posterUrl: String,
  owner: {
    type: String,
    required: [true, 'Owner is required'],
    index: true
  }
}, { strict: true })

movieSchema.add(BASE_SCHEMA)

export const Movie = mongoose.model('Movie', movieSchema)
