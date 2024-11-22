# Test Tile Tracker

A web application for potters to track and manage their test tiles, glazes, and clay bodies.

## Features

- User authentication and private databases
- Track test tiles with photos and detailed information
- Manage glaze and clay body databases
- Automatic and custom ID generation for test tiles
- Group test tiles into series
- Track relationships between test tiles
- Cloud-based photo storage
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- AWS account for S3 photo storage

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=test_tile_tracker
DB_USER=your_username
DB_PASSWORD=your_password

# AWS S3
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Session
SESSION_SECRET=your_session_secret
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create PostgreSQL database:
   ```bash
   createdb test_tile_tracker
   ```

3. Run database migrations:
   ```bash
   npm run migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.
