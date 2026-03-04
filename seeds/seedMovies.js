import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import csv from 'csv-parser'
import { connectToDatabase } from '../src/config/mongoose.js'
import { Movie } from '../src/models/schemes/movieSchema.js'
import { Genre } from '../src/models/schemes/genreSchema.js'
import { Language } from '../src/models/schemes/languageSchema.js'

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, '../public/data/mymoviedb.csv')

async function seedDatabase() {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB')

    // Step 1: Parse CSV and collect unique genres/languages
    const movies = []
    const genresSet = new Set()
    const languagesSet = new Set()

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          movies.push(row)

          if (row.Genre) {
            row.Genre.split(',').forEach(g => genresSet.add(g.trim()))
          }

          if (row.Original_Language) {
            languagesSet.add(row.Original_Language)
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    // Step 2: Insert genres (only new ones)
    const existingGenres = await Genre.find({}, '_id')
    const existingGenreIds = new Set(existingGenres.map(g => g._id))
    const newGenreDocs = Array.from(genresSet)
      .filter(name => !existingGenreIds.has(name))
      .map(name => ({ _id: name, name }))

    if (newGenreDocs.length > 0) {
      await Genre.collection.insertMany(newGenreDocs)
      console.log(`Added ${newGenreDocs.length} new genres`)
    }
    console.log(`${existingGenres.length} existing genres`)

    // Step 3: Insert languages (only new ones)
    const existingLanguages = await Language.find({}, '_id')
    const existingLanguageIds = new Set(existingLanguages.map(l => l._id))
    const newLanguageDocs = Array.from(languagesSet)
      .filter(code => !existingLanguageIds.has(code))
      .map(code => ({ _id: code, code }))

    if (newLanguageDocs.length > 0) {
      await Language.collection.insertMany(newLanguageDocs)
      console.log(`Added ${newLanguageDocs.length} new languages`)
    }
    console.log(`${existingLanguages.length} existing languages`)

    // Step 4: Transform movie data
    const movieDocs = movies.map(row => {
      const firstGenre = row.Genre ? row.Genre.split(',')[0].trim() : null

      return {
        releaseDate: row.Release_Date || '',
        title: row.Title || '',
        overview: row.Overview || '',
        popularity: parseFloat(row.Popularity) || 0,
        voteCount: parseInt(row.Vote_Count) || 0,
        voteAverage: parseFloat(row.Vote_Average) || 0,
        genre: firstGenre && genresSet.has(firstGenre) ? firstGenre : null,
        language: row.Original_Language && languagesSet.has(row.Original_Language) ? row.Original_Language : null,
        posterUrl: row.Poster_Url || ''
      }
    })

    // Step 5: Prevent duplicates
    const existingMovies = await Movie.find({}, 'title')
    const existingTitles = new Set(existingMovies.map(m => m.title))
    const moviesToInsert = movieDocs.filter(m => !existingTitles.has(m.title))

    console.log(`Found ${existingTitles.size} existing movies, will add ${moviesToInsert.length} new movies`)

    // Step 6: Insert movies in batches
    const batchSize = 1000
    for (let i = 0; i < moviesToInsert.length; i += batchSize) {
      const batch = moviesToInsert.slice(i, i + batchSize)
      await Movie.insertMany(batch)
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} movies)`)
    }

    console.log(`Successfully seeded ${moviesToInsert.length} new movies!`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()