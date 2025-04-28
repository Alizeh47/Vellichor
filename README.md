# Vellichor - Book Reading Application

## Database Setup Instructions

This repository contains scripts to set up the Supabase database for the Vellichor book reading application. Follow these instructions to properly set up your database.

### Supabase Project Information
- **Project URL**: https://tuaugwdgynscaekexhsr.supabase.co
- **Public Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc

## Setup Options

### Option 1: Using Automated Scripts

Run the following commands to try to automatically set up the database:

   ```bash
# Install dependencies
npm install @supabase/supabase-js

# Run the scripts to set up the database
node scripts/supabase-direct.js
node scripts/setup-security.js
```

Note: These scripts may encounter Row Level Security (RLS) policy issues if the tables have already been created. In that case, proceed to Option 2.

### Option 2: Manual Setup Through the Supabase Dashboard

If the scripts encounter issues, you can follow the detailed manual setup instructions:

1. Open the [Supabase dashboard](https://app.supabase.io/)
2. Select your project
3. Follow the instructions in the `scripts/manual-setup-guide.md` file

## Database Schema

The Vellichor application uses 18 tables to support its functionality:

1. **users** - User accounts and profile information
2. **books** - Book metadata and content information
3. **chapters** - Individual chapters of books
4. **user_bookmarks** - User's bookmarked books and reading progress
5. **reading_lists** - User-created lists of books
6. **reading_list_books** - Books within reading lists
7. **wishlist** - Books users want to read later
8. **genres** - Book categories
9. **book_genres** - Association between books and genres
10. **tropes** - Literary tropes for categorizing books
11. **book_tropes** - Association between books and tropes
12. **tags** - Miscellaneous tags for books
13. **book_tags** - Association between books and tags
14. **reviews** - User reviews and ratings of books
15. **user_preferences** - User settings and preferences
16. **recent_searches** - User's search history
17. **user_reading_stats** - User reading metrics
18. **user_friends** - User social connections

## Verifying the Setup

After setting up the database, you can verify it's working by using the frontend integration:

```javascript
import { supabase, getAllBooks, getAllGenres } from './supabase-integration';

// Test database connection
async function testConnection() {
  try {
    // Get all books
    const books = await getAllBooks();
    console.log('Books:', books);
    
    // Get all genres
    const genres = await getAllGenres();
    console.log('Genres:', genres);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();
```

## Troubleshooting

If you encounter issues:

1. **RLS Policy Errors**: These may occur if you're trying to insert data without properly authenticating or if policies are not correctly set up. Review the RLS policies in `scripts/manual-setup-guide.md`.

2. **No Tables Found**: Ensure you've completed either the automated or manual setup process.

3. **Authentication Errors**: Make sure you're using the correct project URL and anon key.

For complete details on database structure and SQL commands, refer to the files in the `scripts/` directory.
