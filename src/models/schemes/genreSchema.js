import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

genreSchema.add(BASE_SCHEMA)

export const Genre = mongoose.model('Genre', genreSchema)
