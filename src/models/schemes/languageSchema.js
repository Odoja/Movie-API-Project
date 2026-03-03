import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const languageSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: String
})

languageSchema.add(BASE_SCHEMA)

export const Language = mongoose.model('Language', languageSchema)
