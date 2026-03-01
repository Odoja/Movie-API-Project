import mongoose from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema.js'

const movieSchema = new mongoose.Schema({
  releaseDate: String,
  title: String,
  overview: String,
  popularity: Number,
  voteCount: Number,
  voteAverage: Number,
  originalLanguage: String,
  genre: String,
  posterUrl: String
})

movieSchema.add(BASE_SCHEMA)

export const Movie = mongoose.model('Movie', movieSchema)
