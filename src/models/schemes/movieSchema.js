import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const movieSchema = new mongoose.Schema({
  releaseDate: String,
  title: String,
  overview: String,
  popularity: Number,
  voteCount: Number,
  voteAverage: Number,
  genreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  },
  posterUrl: String
})

movieSchema.add(BASE_SCHEMA)

export const Movie = mongoose.model('Movie', movieSchema)
