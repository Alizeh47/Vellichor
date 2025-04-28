# Vellichor Database Setup Guide

This guide provides step-by-step instructions to manually set up your Supabase database tables and security policies for the Vellichor book reading application.

## Project Information
- **Project URL**: https://tuaugwdgynscaekexhsr.supabase.co
- **Public Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc

## Manual Setup Instructions

### 1. Access the Supabase Dashboard
1. Go to [Supabase](https://app.supabase.io/)
2. Sign in and select your project
3. Navigate to the "Table Editor" in the left sidebar

### 2. Create Tables

For each table below, click "Create a new table" and enter the specified information.

#### users
- **Name**: users
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - username (text, unique, not null)
  - email (text, unique, not null)
  - password_hash (text, not null)
  - full_name (text)
  - avatar_url (text)
  - bio (text)
  - created_at (timestamptz, default: now())
  - last_login (timestamptz)
  - location (text)
  - birthday (date)
  - is_premium (boolean, default: false)
  - enabled_features (jsonb, default: '{}')
  - book_count (integer, default: 0)
  - friends_count (integer, default: 0)
  - following_count (integer, default: 0)

#### books
- **Name**: books
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - title (text, not null)
  - author (text, not null)
  - cover_image_url (text)
  - description (text)
  - published_date (date)
  - total_pages (integer)
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())
  - is_featured (boolean, default: false)

Add a unique constraint on title and author.

#### chapters
- **Name**: chapters
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - book_id (uuid, reference: books.id, on delete: cascade)
  - title (text, not null)
  - content (text, not null)
  - chapter_number (integer, not null)
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

Add a unique constraint on book_id and chapter_number.

#### user_bookmarks
- **Name**: user_bookmarks
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - book_id (uuid, reference: books.id, on delete: cascade)
  - current_page (integer, default: 1)
  - last_read_at (timestamptz, default: now())
  - notes (text)
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

Add a unique constraint on user_id and book_id.

#### reading_lists
- **Name**: reading_lists
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - name (text, not null)
  - cover_image_url (text)
  - description (text)
  - is_public (boolean, default: false)
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

#### reading_list_books
- **Name**: reading_list_books
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - reading_list_id (uuid, reference: reading_lists.id, on delete: cascade)
  - book_id (uuid, reference: books.id, on delete: cascade)
  - added_at (timestamptz, default: now())

Add a unique constraint on reading_list_id and book_id.

#### wishlist
- **Name**: wishlist
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - book_id (uuid, reference: books.id, on delete: cascade)
  - added_at (timestamptz, default: now())
  - notes (text)

Add a unique constraint on user_id and book_id.

#### genres
- **Name**: genres
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - name (text, unique, not null)
  - description (text)
  - cover_image_url (text)

#### book_genres
- **Name**: book_genres
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - book_id (uuid, reference: books.id, on delete: cascade)
  - genre_id (uuid, reference: genres.id, on delete: cascade)

Add a unique constraint on book_id and genre_id.

#### tropes
- **Name**: tropes
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - name (text, unique, not null)
  - description (text)
  - color (text)

#### book_tropes
- **Name**: book_tropes
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - book_id (uuid, reference: books.id, on delete: cascade)
  - trope_id (uuid, reference: tropes.id, on delete: cascade)

Add a unique constraint on book_id and trope_id.

#### tags
- **Name**: tags
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - name (text, unique, not null)
  - color (text)
  - icon (text)

#### book_tags
- **Name**: book_tags
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - book_id (uuid, reference: books.id, on delete: cascade)
  - tag_id (uuid, reference: tags.id, on delete: cascade)

Add a unique constraint on book_id and tag_id.

#### reviews
- **Name**: reviews
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - book_id (uuid, reference: books.id, on delete: cascade)
  - rating (integer, check: rating >= 1 AND rating <= 5)
  - content (text)
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

Add a unique constraint on user_id and book_id.

#### user_preferences
- **Name**: user_preferences
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade, unique)
  - font_size (integer, default: 18)
  - theme (text, default: 'light')
  - preferred_genres (uuid[], default: '{}')
  - preferred_tropes (uuid[], default: '{}')
  - reading_statistics (jsonb, default: '{}')
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

#### recent_searches
- **Name**: recent_searches
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - query (text, not null)
  - count (integer, default: 1)
  - color (text)
  - searched_at (timestamptz, default: now())

#### user_reading_stats
- **Name**: user_reading_stats
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - date (date, not null)
  - hours_read (decimal(5,2), default: 0)
  - pages_read (integer, default: 0)
  - books_completed (integer, default: 0)

Add a unique constraint on user_id and date.

#### user_friends
- **Name**: user_friends
- **Enable Row Level Security**: ✅
- **Columns**:
  - id (uuid, primary key, default: uuid_generate_v4())
  - user_id (uuid, reference: users.id, on delete: cascade)
  - friend_id (uuid, reference: users.id, on delete: cascade)
  - status (text, check: status IN ('pending', 'accepted', 'rejected', 'blocked'))
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

Add a unique constraint on user_id and friend_id.

### 3. Set Up Row Level Security (RLS) Policies

Navigate to the "Authentication" → "Policies" section in the left sidebar to create the following policies for each table.

#### users
- Create Policy: "Users can view their own data"
  - For operation: SELECT
  - Using expression: `auth.uid() = id`
- Create Policy: "Users can update their own data"
  - For operation: UPDATE
  - Using expression: `auth.uid() = id`

#### books
- Create Policy: "Anyone can view books"
  - For operation: SELECT
  - Using expression: `true`

#### chapters
- Create Policy: "Anyone can view chapters"
  - For operation: SELECT
  - Using expression: `true`

#### user_bookmarks
- Create Policy: "Users can view their own bookmarks"
  - For operation: SELECT
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can insert their own bookmarks"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update their own bookmarks"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can delete their own bookmarks"
  - For operation: DELETE
  - Using expression: `auth.uid() = user_id`

#### reading_lists
- Create Policy: "Users can view their own reading lists"
  - For operation: SELECT
  - Using expression: `auth.uid() = user_id OR is_public = true`
- Create Policy: "Users can insert their own reading lists"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update their own reading lists"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can delete their own reading lists"
  - For operation: DELETE
  - Using expression: `auth.uid() = user_id`

#### reading_list_books
- Create Policy: "View books in reading lists"
  - For operation: SELECT
  - Using expression: `EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_books.reading_list_id AND (reading_lists.user_id = auth.uid() OR reading_lists.is_public = true))`
- Create Policy: "Add books to reading lists"
  - For operation: INSERT
  - With check expression: `EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_books.reading_list_id AND reading_lists.user_id = auth.uid())`
- Create Policy: "Delete books from reading lists"
  - For operation: DELETE
  - Using expression: `EXISTS (SELECT 1 FROM public.reading_lists WHERE reading_lists.id = reading_list_books.reading_list_id AND reading_lists.user_id = auth.uid())`

#### wishlist
- Create Policy: "Users can view their own wishlist"
  - For operation: SELECT
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can add to their own wishlist"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update their own wishlist items"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can delete from their own wishlist"
  - For operation: DELETE
  - Using expression: `auth.uid() = user_id`

#### genres, book_genres, tropes, book_tropes, tags, book_tags
- For each of these tables, create a Policy: "Anyone can view [table name]"
  - For operation: SELECT
  - Using expression: `true`

#### reviews
- Create Policy: "Anyone can view reviews"
  - For operation: SELECT
  - Using expression: `true`
- Create Policy: "Users can insert their own reviews"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update their own reviews"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can delete their own reviews"
  - For operation: DELETE
  - Using expression: `auth.uid() = user_id`

#### user_preferences
- Create Policy: "Users can view their own preferences"
  - For operation: SELECT
  - Using expression: `auth.uid() = user_id`
- Create Policy: "Users can insert their own preferences"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update their own preferences"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id`

#### recent_searches, user_reading_stats
- For both tables, create policies:
  - "Users can view their own [recent searches/reading stats]"
    - For operation: SELECT
    - Using expression: `auth.uid() = user_id`
  - "Users can insert their own [recent searches/reading stats]"
    - For operation: INSERT
    - With check expression: `auth.uid() = user_id`
  - "Users can update their own [recent searches/reading stats]"
    - For operation: UPDATE
    - Using expression: `auth.uid() = user_id`
  - "Users can delete their own [recent searches/reading stats]" (for recent_searches only)
    - For operation: DELETE
    - Using expression: `auth.uid() = user_id`

#### user_friends
- Create Policy: "Users can view their own friend connections"
  - For operation: SELECT
  - Using expression: `auth.uid() = user_id OR auth.uid() = friend_id`
- Create Policy: "Users can insert their own friend requests"
  - For operation: INSERT
  - With check expression: `auth.uid() = user_id`
- Create Policy: "Users can update friend status if they're involved"
  - For operation: UPDATE
  - Using expression: `auth.uid() = user_id OR auth.uid() = friend_id`
- Create Policy: "Users can delete their own friend connections"
  - For operation: DELETE
  - Using expression: `auth.uid() = user_id OR auth.uid() = friend_id`

### 4. Configure Authentication

1. Navigate to the "Authentication" → "Settings" section
2. Ensure "Email Auth" is enabled
3. Configure any additional authentication providers as needed

### 5. Add Sample Data

After creating all tables, you can add sample data using the "Table Editor" interface or by running SQL queries in the "SQL Editor".

#### Sample Genres
```sql
INSERT INTO genres (name, description, cover_image_url)
VALUES
  ('Crime & Mystery', 'Books involving criminal cases, detectives, and puzzle-solving', 'genres/crime.jpg'),
  ('Science Fiction', 'Speculative fiction exploring futuristic concepts, technology, and space', 'genres/scifi.jpg'),
  ('Romance', 'Stories focused on romantic relationships and emotional fulfillment', 'genres/romance.jpg'),
  ('Fantasy', 'Fiction featuring magical elements, mythical creatures, and imaginary worlds', 'genres/fantasy.jpg'),
  ('Horror', 'Stories designed to frighten, scare, or startle the reader', 'genres/horror.jpg');
```

#### Sample Books
```sql
INSERT INTO books (title, author, cover_image_url, description, total_pages)
VALUES
  ('The Here And Now', 'Jillian Lawrence', 'fantasy_book1.jpg', 'A thought-provoking journey through time and space, exploring the concept of living in the present moment while reconciling with the past.', 320),
  ('Silent Echo', 'Maya Rivers', 'fantasy_book2.jpg', 'When a mysterious sound phenomenon appears in a small coastal town, a young scientist must uncover its secrets before it consumes everything.', 280),
  ('The Stranger In The Lake', 'Sloane Collins', 'crime_book1.jpg', 'A chilling tale of a body discovered in a peaceful mountain lake, and the dark secrets that emerge as a small town detective digs deeper.', 350);
```

#### Sample Tropes
```sql
INSERT INTO tropes (name, description, color)
VALUES
  ('Enemies to Lovers', 'Characters who start as adversaries develop romantic feelings over time', '#916F5E'),
  ('Grumpy x Sunshine', 'A pairing between a pessimistic character and an optimistic one', '#005A74'),
  ('Found Family', 'Characters with little or no blood relation form deep familial bonds', '#623D33'),
  ('Secret Royal', 'A character discovers they have royal heritage or is hiding royal status', '#B39285'),
  ('The Chosen One', 'A character destined to fulfill a prophecy or special purpose', '#C78E65');
```

#### Sample Tags
```sql
INSERT INTO tags (name, color, icon)
VALUES
  ('Main Character Meltdowns', '#916F5E', 'heart-broken'),
  ('Angst But Make It Pretty', '#25323A', 'band-aid'),
  ('Soft Magic & Sharp Morals', '#B39285', 'book-dead'),
  ('Read This With a Blanket and Tea', '#25323A', 'swords'),
  ('Whispers Between Pages', '#917E78', 'wolf-pack-battalion');
```

## Additional Configuration

### Storage
If you plan to upload book covers or user avatars:
1. Navigate to "Storage" in the left sidebar
2. Create buckets for "avatars" and "book-covers" 
3. Configure appropriate access policies

### Edge Functions
For any server-side logic requirements:
1. Navigate to "Edge Functions" in the left sidebar
2. Create functions as needed for specific features

## Integration with Frontend
Update your frontend application's Supabase configuration with:
```javascript
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);
``` 