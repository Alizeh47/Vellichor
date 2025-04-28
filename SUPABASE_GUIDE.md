# Vellichor Supabase Database Guide

This guide provides information on how to use the Supabase database tables for the Vellichor book reading application.

## Connection Information
- **Project URL**: https://tuaugwdgynscaekexhsr.supabase.co
- **Public Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc

## Initializing Connection

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);
```

## Tables Overview

### 1. users
Stores user account information.

**Fields:**
- `id` (UUID, PK): User identifier
- `username` (TEXT): Unique username
- `email` (TEXT): User's email address
- `password_hash` (TEXT): Hashed password (managed by Supabase Auth)
- `full_name` (TEXT): User's full name
- `avatar_url` (TEXT): URL to profile picture
- `bio` (TEXT): User biography
- `created_at` (TIMESTAMPTZ): Account creation date
- `last_login` (TIMESTAMPTZ): Last login timestamp
- `location` (TEXT): User's location
- `birthday` (DATE): User's birthday
- `is_premium` (BOOLEAN): Premium account status
- `enabled_features` (JSONB): Enabled premium features
- `book_count` (INTEGER): Number of books in library
- `friends_count` (INTEGER): Number of friends
- `following_count` (INTEGER): Number of users being followed

**Example Usage:**
```javascript
// Get user profile
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### 2. books
Stores information about books.

**Fields:**
- `id` (UUID, PK): Book identifier
- `title` (TEXT): Book title
- `author` (TEXT): Book author
- `cover_image_url` (TEXT): URL to book cover image
- `description` (TEXT): Book description
- `published_date` (DATE): Publication date
- `total_pages` (INTEGER): Total number of pages
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date
- `is_featured` (BOOLEAN): Featured book status

**Example Usage:**
```javascript
// Get all books
const { data, error } = await supabase
  .from('books')
  .select('*');

// Search books
const { data, error } = await supabase
  .from('books')
  .select('*')
  .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`);
```

### 3. chapters
Stores book chapters.

**Fields:**
- `id` (UUID, PK): Chapter identifier
- `book_id` (UUID, FK): Reference to books.id
- `title` (TEXT): Chapter title
- `content` (TEXT): Chapter content
- `chapter_number` (INTEGER): Chapter number
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get all chapters for a book
const { data, error } = await supabase
  .from('chapters')
  .select('*')
  .eq('book_id', bookId)
  .order('chapter_number', { ascending: true });
```

### 4. user_bookmarks
Tracks user bookmarks and reading progress.

**Fields:**
- `id` (UUID, PK): Bookmark identifier
- `user_id` (UUID, FK): Reference to users.id
- `book_id` (UUID, FK): Reference to books.id
- `current_page` (INTEGER): Current page number
- `last_read_at` (TIMESTAMPTZ): Last reading timestamp
- `notes` (TEXT): User notes
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get user's bookmarks
const { data, error } = await supabase
  .from('user_bookmarks')
  .select('*, books(*)')
  .eq('user_id', userId);

// Update reading progress
const { error } = await supabase
  .from('user_bookmarks')
  .update({ current_page: 42, last_read_at: new Date() })
  .eq('user_id', userId)
  .eq('book_id', bookId);
```

### 5. reading_lists
Stores user-created reading lists.

**Fields:**
- `id` (UUID, PK): Reading list identifier
- `user_id` (UUID, FK): Reference to users.id
- `name` (TEXT): List name
- `cover_image_url` (TEXT): URL to cover image
- `description` (TEXT): List description
- `is_public` (BOOLEAN): Public visibility flag
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get user's reading lists
const { data, error } = await supabase
  .from('reading_lists')
  .select('*')
  .eq('user_id', userId);

// Create a new reading list
const { data, error } = await supabase
  .from('reading_lists')
  .insert([
    { 
      user_id: userId, 
      name: 'My Summer Reads', 
      description: 'Books to read this summer', 
      is_public: true 
    }
  ]);
```

### 6. reading_list_books
Junction table linking books to reading lists.

**Fields:**
- `id` (UUID, PK): Record identifier
- `reading_list_id` (UUID, FK): Reference to reading_lists.id
- `book_id` (UUID, FK): Reference to books.id
- `added_at` (TIMESTAMPTZ): Date book was added to list

**Example Usage:**
```javascript
// Get books in a reading list
const { data, error } = await supabase
  .from('reading_lists')
  .select(`
    *,
    reading_list_books(
      books(*)
    )
  `)
  .eq('id', readingListId)
  .single();

// Add a book to a reading list
const { error } = await supabase
  .from('reading_list_books')
  .insert([
    { reading_list_id: readingListId, book_id: bookId }
  ]);
```

### 7. wishlist
Stores books users want to read later.

**Fields:**
- `id` (UUID, PK): Wishlist entry identifier
- `user_id` (UUID, FK): Reference to users.id
- `book_id` (UUID, FK): Reference to books.id
- `added_at` (TIMESTAMPTZ): Date added to wishlist
- `notes` (TEXT): User notes

**Example Usage:**
```javascript
// Get user's wishlist
const { data, error } = await supabase
  .from('wishlist')
  .select('*, books(*)')
  .eq('user_id', userId);

// Add book to wishlist
const { error } = await supabase
  .from('wishlist')
  .insert([
    { user_id: userId, book_id: bookId }
  ]);
```

### 8. genres, 9. book_genres
Stores book genres and book-genre associations.

**genres Fields:**
- `id` (UUID, PK): Genre identifier
- `name` (TEXT): Genre name
- `description` (TEXT): Genre description
- `cover_image_url` (TEXT): URL to genre image

**book_genres Fields:**
- `id` (UUID, PK): Record identifier
- `book_id` (UUID, FK): Reference to books.id
- `genre_id` (UUID, FK): Reference to genres.id

**Example Usage:**
```javascript
// Get all genres
const { data, error } = await supabase
  .from('genres')
  .select('*');

// Get books in a genre
const { data, error } = await supabase
  .from('book_genres')
  .select('books(*)')
  .eq('genre_id', genreId);

// Get genres for a book
const { data, error } = await supabase
  .from('book_genres')
  .select('genres(*)')
  .eq('book_id', bookId);
```

### 10. tropes, 11. book_tropes
Stores literary tropes and book-trope associations.

**tropes Fields:**
- `id` (UUID, PK): Trope identifier
- `name` (TEXT): Trope name
- `description` (TEXT): Trope description
- `color` (TEXT): Color code for UI display

**book_tropes Fields:**
- `id` (UUID, PK): Record identifier
- `book_id` (UUID, FK): Reference to books.id
- `trope_id` (UUID, FK): Reference to tropes.id

**Example Usage:**
```javascript
// Get all tropes
const { data, error } = await supabase
  .from('tropes')
  .select('*');

// Get books with a specific trope
const { data, error } = await supabase
  .from('book_tropes')
  .select('books(*)')
  .eq('trope_id', tropeId);
```

### 12. tags, 13. book_tags
Stores tags and book-tag associations.

**tags Fields:**
- `id` (UUID, PK): Tag identifier
- `name` (TEXT): Tag name
- `color` (TEXT): Color code for UI display
- `icon` (TEXT): Icon name for UI display

**book_tags Fields:**
- `id` (UUID, PK): Record identifier
- `book_id` (UUID, FK): Reference to books.id
- `tag_id` (UUID, FK): Reference to tags.id

**Example Usage:**
```javascript
// Get all tags
const { data, error } = await supabase
  .from('tags')
  .select('*');

// Get books with a specific tag
const { data, error } = await supabase
  .from('book_tags')
  .select('books(*)')
  .eq('tag_id', tagId);
```

### 14. reviews
Stores user reviews and ratings of books.

**Fields:**
- `id` (UUID, PK): Review identifier
- `user_id` (UUID, FK): Reference to users.id
- `book_id` (UUID, FK): Reference to books.id
- `rating` (INTEGER): Rating (1-5)
- `content` (TEXT): Review text
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get reviews for a book
const { data, error } = await supabase
  .from('reviews')
  .select('*, users(username, avatar_url)')
  .eq('book_id', bookId);

// Add a review
const { error } = await supabase
  .from('reviews')
  .insert([
    { 
      user_id: userId, 
      book_id: bookId, 
      rating: 4, 
      content: 'Great book, highly recommend!' 
    }
  ]);
```

### 15. user_preferences
Stores user settings and preferences.

**Fields:**
- `id` (UUID, PK): Preferences identifier
- `user_id` (UUID, FK): Reference to users.id
- `font_size` (INTEGER): Reading font size
- `theme` (TEXT): UI theme preference
- `preferred_genres` (UUID[]): Array of preferred genre IDs
- `preferred_tropes` (UUID[]): Array of preferred trope IDs
- `reading_statistics` (JSONB): Reading statistics data
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get user preferences
const { data, error } = await supabase
  .from('user_preferences')
  .select('*')
  .eq('user_id', userId)
  .single();

// Update user preferences
const { error } = await supabase
  .from('user_preferences')
  .update({ 
    font_size: 20, 
    theme: 'dark',
    preferred_genres: [genre1Id, genre2Id]
  })
  .eq('user_id', userId);
```

### 16. recent_searches
Stores user search history.

**Fields:**
- `id` (UUID, PK): Search record identifier
- `user_id` (UUID, FK): Reference to users.id
- `query` (TEXT): Search query
- `count` (INTEGER): Number of times searched
- `color` (TEXT): Color code for UI display
- `searched_at` (TIMESTAMPTZ): Last search timestamp

**Example Usage:**
```javascript
// Get user's recent searches
const { data, error } = await supabase
  .from('recent_searches')
  .select('*')
  .eq('user_id', userId)
  .order('searched_at', { ascending: false });

// Add or update a recent search
const { data: existingSearch } = await supabase
  .from('recent_searches')
  .select('*')
  .eq('user_id', userId)
  .eq('query', searchQuery)
  .single();

if (existingSearch) {
  // Update existing search
  await supabase
    .from('recent_searches')
    .update({ 
      count: existingSearch.count + 1,
      searched_at: new Date()
    })
    .eq('id', existingSearch.id);
} else {
  // Create new search record
  await supabase
    .from('recent_searches')
    .insert([
      { 
        user_id: userId, 
        query: searchQuery,
        color: randomColor() 
      }
    ]);
}
```

### 17. user_reading_stats
Stores user reading statistics.

**Fields:**
- `id` (UUID, PK): Stats record identifier
- `user_id` (UUID, FK): Reference to users.id
- `date` (DATE): Date of reading activity
- `hours_read` (DECIMAL): Hours spent reading
- `pages_read` (INTEGER): Pages read
- `books_completed` (INTEGER): Books completed

**Example Usage:**
```javascript
// Get user's reading stats for a date range
const { data, error } = await supabase
  .from('user_reading_stats')
  .select('*')
  .eq('user_id', userId)
  .gte('date', startDate)
  .lte('date', endDate)
  .order('date');

// Record reading activity
const { error } = await supabase
  .from('user_reading_stats')
  .upsert([
    { 
      user_id: userId, 
      date: today,
      hours_read: 1.5,
      pages_read: 45
    }
  ]);
```

### 18. user_friends
Manages user friend connections.

**Fields:**
- `id` (UUID, PK): Connection identifier
- `user_id` (UUID, FK): Reference to users.id (the requester)
- `friend_id` (UUID, FK): Reference to users.id (the target)
- `status` (TEXT): Friendship status ('pending', 'accepted', 'rejected', 'blocked')
- `created_at` (TIMESTAMPTZ): Record creation date
- `updated_at` (TIMESTAMPTZ): Record update date

**Example Usage:**
```javascript
// Get user's friends
const { data, error } = await supabase
  .from('user_friends')
  .select('*, users!friend_id(*)')
  .eq('user_id', userId)
  .eq('status', 'accepted');

// Send friend request
const { error } = await supabase
  .from('user_friends')
  .insert([
    { 
      user_id: currentUserId, 
      friend_id: targetUserId,
      status: 'pending'
    }
  ]);

// Accept friend request
const { error } = await supabase
  .from('user_friends')
  .update({ status: 'accepted', updated_at: new Date() })
  .eq('user_id', friendId)
  .eq('friend_id', userId);
```

## Working with Row Level Security (RLS)

Tables have Row Level Security enabled, which means:

1. **Authentication Required**: For most operations, a user must be authenticated.
2. **Ownership Restrictions**: Users can only access/modify their own data.
3. **Public Content**: Some tables (books, genres, tropes, tags) allow public read access.

To ensure RLS works correctly:

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## Using Supabase with Expo/React Native

For Expo projects, ensure you install the required packages:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

Then initialize Supabase with AsyncStorage:

```javascript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Advanced Queries

### Joining Multiple Tables

```javascript
// Get a book with all related data
const { data, error } = await supabase
  .from('books')
  .select(`
    *,
    chapters(*),
    book_genres(genres(*)),
    book_tropes(tropes(*)),
    book_tags(tags(*)),
    reviews(*, users(username, avatar_url))
  `)
  .eq('id', bookId)
  .single();
```

### Using Filters and Pagination

```javascript
// Get books with pagination and filters
const { data, error } = await supabase
  .from('books')
  .select('*')
  .eq('author', authorName)
  .order('title')
  .range(0, 9); // First 10 items (0-9)

// Get next page
const { data: nextPage, error } = await supabase
  .from('books')
  .select('*')
  .eq('author', authorName)
  .order('title')
  .range(10, 19); // Second 10 items (10-19)
```

### Counting Records

```javascript
// Count books by an author
const { count, error } = await supabase
  .from('books')
  .select('*', { count: 'exact', head: true })
  .eq('author', authorName);
```

## Common Patterns

### User Registration Flow

```javascript
// 1. Sign up with Supabase Auth
const { data: authData, error: authError } = await supabase.auth.signUp({
  email,
  password,
});

// 2. Create user profile in users table
if (authData?.user) {
  const { error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        username,
        email,
        full_name: fullName,
        password_hash: 'stored_in_auth', // We don't actually store this
        created_at: new Date()
      }
    ]);
}
```

### Book Search and Filtering

```javascript
// Search books with genre filter
const { data, error } = await supabase
  .from('books')
  .select(`
    *,
    book_genres!inner(
      genre_id
    )
  `)
  .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
  .eq('book_genres.genre_id', genreId);
```

## Error Handling

Always check for errors when making Supabase queries:

```javascript
const { data, error } = await supabase.from('books').select('*');

if (error) {
  console.error('Error fetching books:', error);
  // Handle error (show message, retry, etc.)
  return;
}

// Continue with data
console.log('Books:', data);
```

## Troubleshooting

### RLS Permission Errors

If you see "new row violates row-level security policy for table..." errors:

1. Check if the user is authenticated
2. Verify the user has permission for the operation
3. Check RLS policies on the Supabase dashboard

### Performance Optimization

For large tables or complex queries:

1. Use specific column selection instead of `*`
2. Add appropriate indexes in Supabase dashboard
3. Use pagination to limit result size

### Connection Issues

If experiencing connection problems:

1. Confirm internet connectivity
2. Verify the Supabase URL and key are correct
3. Check if the Supabase project is active

## Further Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase React Hooks](https://supabase.com/docs/reference/javascript/subscribe)
- [Supabase Discord](https://discord.supabase.com) 