# Digital Bevy Backend

This is the backend API for the Digital Bevy project. It provides endpoints to search GitHub repositories by keyword, stores minimal information about the first 5 results per keyword in a MySQL database using Sequelize ORM, and serves stored results for frontend consumption.
## Features
- Search GitHub repositories by keyword (fetches top 5 results)
- Stores only essential repo data per keyword
- Retrieves stored results by keyword
- Uses Sequelize ORM with MySQL database

## Technologies

- Node.js
- Express
- Sequelize
- MySQL
- Axios (for GitHub API requests)
- dotenv (for environment variable management)

##Folder structure 
backend/
├── controllers/
│ └── githubController.js # API logic for GitHub search & results
├── models/
│ └── Result.js # Sequelize model for stored results
├── routes/
│ └── api.js # Express route definitions
├── db.js # Sequelize DB connection setup
├── app.js # Express app configuration
├── server.js # Entry point to start server
├── .env # Environment variables (not committed)
├── package.json # Project metadata and dependencies
