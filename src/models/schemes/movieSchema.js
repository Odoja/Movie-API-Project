import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const movieSchema = new mongoose.Schema({
  releaseDate: String,
  title: String,
  overview: String,
  popularity: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  voteAverage: { type: Number, default: 0 },
  genre: {
    type: String,
    ref: 'Genre'
  },
  language: {
    type: String,
    ref: 'Language'
  },
  posterUrl: String
}, { strict: true })

movieSchema.add(BASE_SCHEMA)

export const Movie = mongoose.model('Movie', movieSchema)
