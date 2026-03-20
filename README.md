# API Design Assignment

## Project Name

API Design Assignment

## Objective

Design and develop a robust, well-documented API (REST or GraphQL) that allows users to retrieve and manage information from a dataset of your choice. The API must include JWT authentication, automated testing via Postman/Newman in a CI/CD pipeline, and be publicly deployed.

Choose a dataset (10000+ data points) that interests you — it should include at least one primary CRUD resource and two additional read-only resources. Sources like [Kaggle](https://www.kaggle.com/datasets), public APIs, or CSV files work well. Pick something you find interesting, as you will reuse this API in the next assignment (WT dashboard).

*Describe your API in a few sentences: what dataset does it serve, what are its main resources, and what can users do with it?*

## Implementation Type

REST

## Links and Testing

| | URL / File |
|---|---|
| **Production API** | https://cu0203.camp.lnu.se/api |
| **Movies** |`/movies`|
| **Genres** |`/genres`|
| **Languages** |`/languages`|
| **API Documentation** | https://cu0203.camp.lnu.se/api/api-docs/#/ |
| **Postman Collection** | `*.postman_collection.json` |
| **Production Environment** | `production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitLab for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run postman-collection.json -e production.postman_environment.json --insecure
   ```

## Dataset

Dataset with +9000 movies

| Field | Description |
|---|---|
| **Dataset source** | [9000+ Movies Dataset – Kaggle](https://www.kaggle.com/datasets/disham993/9000-movies-dataset) |
| **Primary resource (CRUD)** | Movies (Title, Release_Date, Overview, Popularity, Vote_Count, Vote_Average, Poster_Url) |
| **Secondary resource 1 (read-only)** | Genre (ID, name) |
| **Secondary resource 2 (read-only)** | Language (ID, Code) |


## Design Decisions

### Authentication

**JWT Token-Based Authentication**

**Why JWT?**
- **Stateless**: Server doesn't need to store sessions — tokens contain all needed information
- **Scalable**: Works seamlessly across multiple servers without shared session storage
- **Self-contained**: Token includes user ID, preventing database lookups for authorization

**Implementation Details:**
- **Bearer Token Scheme**: Clients send tokens via `Authorization: Bearer <token>` header
- **Token Generation**: Issued on successful login (POST `/user/login`)
- **Token Validation**: Middleware (`authenticateJWT`) verifies token signature using `JWT_SECRET` environment variable
- **Protected Routes**: All write operations (POST/PUT/DELETE) require valid JWT token
- **Error Handling**: Invalid/expired tokens return 401 Unauthorized

**Alternatives & Trade-offs:**
| Approach | Pros | Cons |
|---|---|---|
| JWT | Stateless, scalable, self-contained | Token revocation is difficult, token hijacking possible if insecure |
| Session-based (cookie) | Easier to revoke; simpler for same-origin requests | Requires server-side storage, harder to scale; CSRF risks |
| OAuth 2.0 / OpenID | Industry standard; delegated auth | Overkill for simple APIs, more complexity |
| API Keys | Simple to implement | No encryption, poor for sensitive operations |

---

### API Design

**RESTful Resource-Oriented Architecture**

API follows REST principles with clear resource URLs and HTTP methods:

**Resource Structure:**
```
Base URL: https://cu0203.camp.lnu.se/api

├── /user
│   ├── POST /user/register     → Create new user
│   └── POST /user/login        → Authenticate and get JWT token
│
├── /movies                      → Primary CRUD resource
│   ├── GET /movies              → List all (paginated)
│   ├── GET /movies/{id}         → Get single movie
│   ├── POST /movies             → Create movie (requires auth)
│   ├── PUT /movies/{id}         → Update movie (requires auth)
│   └── DELETE /movies/{id}      → Delete movie (requires auth)
│
├── /genres                      → Secondary read-only resource
│   ├── GET /genres              → List all genres
│   └── GET /genres/{id}         → Get single genre
│
└── /languages                   → Secondary read-only resource
    ├── GET /languages           → List all languages
    └── GET /languages/{id}      → Get single language
```

**HTTP Methods & Status Codes:**
- **GET** → 200 OK (success), 404 Not Found, 500 Internal Server Error
- **POST** → 201 Created (success), 400 Bad Request, 401 Unauthorized, 409 Conflict, 500 Internal Server Error
- **PUT** → 204 No Content (success), 400 Bad Request, 401 Unauthorized, 403 Frobidden, 404 Not Found, 500 Internal Server Error
- **DELETE** → 204 No Content (success), 401 Unauthorized, 403 Frobidden, 404 Not Found, 500 Internal Server Error

**HATEOAS**

Why HATEOAS?
- **API Discoverability**: Clients can navigate the API by following links instead of hardcoding URLs
- **Self-Documenting**: Response includes available actions (self, create, update, delete)
- **Loose Coupling**: Server can change URLs without breaking clients; clients follow links
- **Reduced Client-Server Coupling**: Clients don't need to know URL structure beforehand

**Implementation:**
Every resource response includes a `_links` array with available operations:

```json
{
  "id": "69bd9abe804660e082699ba1",
  "title": "Inception",
  "releaseDate": "2010-07-16",
  "genres": [
    {
      "id": "69bc7388d3f6fa9c10dc10ff",
      "name": "Action",
      "_links": [
        {
          "href": "https://cu0203.camp.lnu.se/api/genres/69bc7388d3f6fa9c10dc10ff",
          "rel": "self",
          "method": "GET"
        }
      ]
    }
  ],
  "_links": [
    {
      "href": "https://cu0203.camp.lnu.se/api/movies/69bd9abe804660e082699ba1",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "https://cu0203.camp.lnu.se/api/movies",
      "rel": "create",
      "method": "POST"
    },
    {
      "href": "https://cu0203.camp.lnu.se/api/movies/69bd9abe804660e082699ba1",
      "rel": "update",
      "method": "PUT"
    },
    {
      "href": "https://cu0203.camp.lnu.se/api/movies/69bd9abe804660e082699ba1",
      "rel": "delete",
      "method": "DELETE"
    }
  ]
}
```

**URL Structure Design:**
- **Nouns, not verbs**: `/movies` (not `/getMovies`)
- **Resource hierarchy**: `/movies/{id}` for specific resources
- **Consistent naming**: Plural resource names for consistency
- **Query parameters for filtering**: `/movies?page=2` for pagination

---

### Error Handling

**Consistent, Informative Error Responses**

All errors follow a standardized JSON format for predictable client-side handling:

**Error Response Format:**
```json
{
  "status": <HTTP_STATUS_CODE>,
  "message": "<Human-readable error description>"
}
```

**Error Categories & Examples:**

| Status | Scenario | Example |
|---|---|---|
| **400** | Invalid client input | Missing required fields, invalid date format, invalid genre/language IDs |
| **401** | Authentication required but missing/invalid | Missing token, expired token, invalid token signature |
| **403** | User lacks permission | Attempting to modify another user's resource |
| **404** | Resource not found | Non-existent movie ID, page out of range |
| **409** | Conflict / duplicate | Email or username already registered |
| **500** | Server error | Unexpected database/server failure |

**Implementation:**
- **Centralized Error Handler** (`middleware/errorHandler.js`): Single middleware catches all errors and formats responses
- **Mongoose Validation Errors**: Database validation errors are caught and converted to 400 responses
- **HTTP Status Mapping**: Error messages are mapped to appropriate HTTP status codes
- **Consistent Logging**: All errors logged server-side with full stack trace for debugging

**Example Error Responses:**

```json
// 400: Invalid Input
{
  "status": 400,
  "message": "Release date must be a valid date in YYYY-MM-DD format"
}

// 401: Unauthorized
{
  "status": 401,
  "message": "Unauthorized"
}

// 404: Not Found
{
  "status": 404,
  "message": "Movie not found"
}

// 409: Conflict
{
  "status": 409,
  "message": "Email already in use"
}
```

## Setup & Database Population

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Environment variables configured in `.env` file

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
DB_CONNECTION_STRING=mongodb://localhost:27018/Local-Movie-API-Project
```

### Running the Seed Script

To populate the database with the complete movie dataset (9827 movies from the CSV file), run:

```bash
npm run seed
```

**Prerequisites:**
- MongoDB must be running locally (default: `localhost:27018` or configure in `.env`)
- The `.env` file must have correct `DB_CONNECTION_STRING` pointing to your MongoDB instance

**What the script does:**
- Connects to MongoDB using `DB_CONNECTION_STRING` from `.env`
- Reads `public/data/mymoviedb.csv` (9827 movies)
- Checks for existing movies (by title + release date) to prevent duplicates
- Inserts only new movies in optimized batches of 1000
- Logs progress and duplicate detection for each batch
- Safe to run multiple times — duplicates are skipped

**Expected output (first run):**
```
Connected to MongoDB
Parsed 9827 movies from CSV
Upserted 19 genres
Upserted 43 languages
Inserted batch 1 (1000 new movies, 0 skipped as duplicates)
Inserted batch 2 (1000 new movies, 0 skipped as duplicates)
...
Inserted batch 10 (827 new movies, 0 skipped as duplicates)
✓ Successfully seeded database! 9827 new movies added, 0 duplicates skipped.
```

**Expected output:**
```
Connected to MongoDB
Parsed 9827 movies from CSV
Upserted 19 genres
Upserted 43 languages
Batch 1: All 1000 movies already exist, skipped
Batch 2: All 1000 movies already exist, skipped
...
✓ Successfully seeded database! 0 new movies added, 9827 duplicates skipped.
```

## Core Technologies Used

*List the technologies you chose and briefly explain why:*


## Reflection

*What was hard? What did you learn? What would you do differently?*

## Acknowledgements

*Resources, attributions, or shoutouts.*

## Requirements

See [all requirements in Issues](../../issues/). Close issues as you implement them. Create additional issues for any custom functionality. See [TESTING.md](TESTING.md) for detailed testing requirements.

### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | ✅ |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | ✅ |
| JWT authentication for write operations | [#3](../../issues/3) | ✅ |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | ✅ |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :white_large_square: |

### Functional Requirements — REST

| Requirement | Issue | Status |
|---|---|---|
| RESTful endpoints with proper HTTP methods and status codes | [#12](../../issues/12) | ✅ |
| HATEOAS (hypermedia links in responses) | [#13](../../issues/13) | ✅ |

### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | ❌ |
| At least one nested query | [#15](../../issues/15) | ❌ |
| GraphQL Playground available | [#16](../../issues/16) | ❌ |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :white_large_square: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :white_large_square: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :white_large_square: |
| Seed script for sample data | [#5](../../issues/5) | ✅ |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :white_large_square: |
| Deployed and publicly accessible | [#9](../../issues/9) | :white_large_square: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |


