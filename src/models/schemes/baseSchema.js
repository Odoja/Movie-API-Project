import mongoose from 'mongoose'

// Options to use converting the document to a plain object and JSON.
const convertOptions = Object.freeze({
  getters: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id
    return ret
  }
})

// Create a schema.
const baseSchema = new mongoose.Schema({}, {
  // Add and maintain createdAt and updatedAt fields.
  timestamps: false,
  versionKey: false,
  // Set the options to use when converting the document to a POJO (or DTO) or JSON.
  // POJO = Plain Old JavaScript Object
  // DTO = Data Transfer Object
  toObject: convertOptions,
  toJSON: convertOptions,
  // Enable optimistic concurrency control. This is a strategy to ensure the
  // document you're updating didn't change between when you loaded it, and
  // when you update it.
  optimisticConcurrency: false
})

export const BASE_SCHEMA = Object.freeze(baseSchema)
