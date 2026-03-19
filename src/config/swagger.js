import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie API',
      version: '1.0.0',
      description: 'A RESTful API for managing movies with JWT authentication and HATEOAS support',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        Movie: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Movie ID' },
            title: { type: 'string', description: 'Movie title' },
            releaseDate: { type: 'string', format: 'date', description: 'Release date (YYYY-MM-DD)' },
            overview: { type: 'string', description: 'Movie overview' },
            popularity: { type: 'number', description: 'Popularity score' },
            voteCount: { type: 'number', description: 'Number of votes' },
            voteAverage: { type: 'number', description: 'Average vote score' },
            posterUrl: { type: 'string', description: 'URL to poster image' },
            genres: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Genre'
              }
            },
            language: {
              $ref: '#/components/schemas/Language'
            },
            _links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  href: { type: 'string' },
                  rel: { type: 'string' },
                  method: { type: 'string' }
                }
              }
            }
          }
        },
        Genre: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            _links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  href: { type: 'string' },
                  rel: { type: 'string' },
                  method: { type: 'string' }
                }
              }
            }
          }
        },
        Language: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            code: { type: 'string' },
            _links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  href: { type: 'string' },
                  rel: { type: 'string' },
                  method: { type: 'string' }
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/router.js',
    './src/routes/user/userRouter.js',
    './src/routes/database/movieRouter.js',
    './src/routes/database/genreRouter.js',
    './src/routes/database/languageRouter.js'
  ]
}

export const swaggerSpec = swaggerJsdoc(options)
