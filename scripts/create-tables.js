const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL queries to create all the tables
const createTableQueries = [
  // 1. users table
  `CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    location TEXT,
    birthday DATE,
    is_premium BOOLEAN DEFAULT FALSE,
    enabled_features JSONB DEFAULT '{}',
    book_count INTEGER DEFAULT 0,
    friends_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0
  );`,

  // 2. books table
  `CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image_url TEXT,
    description TEXT,
    published_date DATE,
    total_pages INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    UNIQUE(title, author)
  );`,

  // 3. chapters table
  `CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
  );`,

  // 4. user_bookmarks table
  `CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    current_page INTEGER DEFAULT 1,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
  );`,

  // 5. reading_lists table
  `CREATE TABLE IF NOT EXISTS public.reading_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cover_image_url TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // 6. reading_list_books table
  `CREATE TABLE IF NOT EXISTS public.reading_list_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reading_list_id UUID REFERENCES public.reading_lists(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reading_list_id, book_id)
  );`,

  // 7. wishlist table
  `CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(user_id, book_id)
  );`,

  // 8. genres table
  `CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT
  );`,

  // 9. book_genres table
  `CREATE TABLE IF NOT EXISTS public.book_genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES public.genres(id) ON DELETE CASCADE,
    UNIQUE(book_id, genre_id)
  );`,

  // 10. tropes table
  `CREATE TABLE IF NOT EXISTS public.tropes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT
  );`,

  // 11. book_tropes table
  `CREATE TABLE IF NOT EXISTS public.book_tropes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    trope_id UUID REFERENCES public.tropes(id) ON DELETE CASCADE,
    UNIQUE(book_id, trope_id)
  );`,

  // 12. tags table
  `CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    color TEXT,
    icon TEXT
  );`,

  // 13. book_tags table
  `CREATE TABLE IF NOT EXISTS public.book_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    UNIQUE(book_id, tag_id)
  );`,

  // 14. reviews table
  `CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
  );`,

  // 15. user_preferences table
  `CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    font_size INTEGER DEFAULT 18,
    theme TEXT DEFAULT 'light',
    preferred_genres UUID[] DEFAULT '{}',
    preferred_tropes UUID[] DEFAULT '{}',
    reading_statistics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // 16. recent_searches table
  `CREATE TABLE IF NOT EXISTS public.recent_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    color TEXT,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // 17. user_reading_stats table
  `CREATE TABLE IF NOT EXISTS public.user_reading_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours_read DECIMAL(5, 2) DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
  );`,

  // 18. user_friends table
  `CREATE TABLE IF NOT EXISTS public.user_friends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
  );`,
];

// RLS policy creation queries
const rlsPolicyQueries = [
  // Enable RLS on all tables
  `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.reading_list_books ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.book_genres ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.tropes ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.book_tropes ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.recent_searches ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.user_reading_stats ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE public.user_friends ENABLE ROW LEVEL SECURITY;`,

  // Users table policies
  `CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);`,
  `CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);`,

  // Books table policies
  `CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (TRUE);`,

  // Chapters table policies
  `CREATE POLICY "Anyone can view chapters" ON public.chapters FOR SELECT USING (TRUE);`,

  // User bookmarks policies
  `CREATE POLICY "Users can view their own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can insert their own bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own bookmarks" ON public.user_bookmarks FOR UPDATE USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can delete their own bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);`,

  // Reading lists policies
  `CREATE POLICY "Users can view their own reading lists" ON public.reading_lists FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);`,
  `CREATE POLICY "Users can insert their own reading lists" ON public.reading_lists FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own reading lists" ON public.reading_lists FOR UPDATE USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can delete their own reading lists" ON public.reading_lists FOR DELETE USING (auth.uid() = user_id);`,

  // Reading list books policies
  `CREATE POLICY "View books in reading lists" ON public.reading_list_books FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.reading_lists 
      WHERE reading_lists.id = reading_list_books.reading_list_id 
      AND (reading_lists.user_id = auth.uid() OR reading_lists.is_public = TRUE)
    )
  );`,
  `CREATE POLICY "Add books to reading lists" ON public.reading_list_books FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reading_lists 
      WHERE reading_lists.id = reading_list_books.reading_list_id 
      AND reading_lists.user_id = auth.uid()
    )
  );`,
  `CREATE POLICY "Delete books from reading lists" ON public.reading_list_books FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.reading_lists 
      WHERE reading_lists.id = reading_list_books.reading_list_id 
      AND reading_lists.user_id = auth.uid()
    )
  );`,

  // Wishlist policies
  `CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can add to their own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own wishlist items" ON public.wishlist FOR UPDATE USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);`,

  // Genres policies
  `CREATE POLICY "Anyone can view genres" ON public.genres FOR SELECT USING (TRUE);`,

  // Book genres policies
  `CREATE POLICY "Anyone can view book genres" ON public.book_genres FOR SELECT USING (TRUE);`,

  // Tropes policies
  `CREATE POLICY "Anyone can view tropes" ON public.tropes FOR SELECT USING (TRUE);`,

  // Book tropes policies
  `CREATE POLICY "Anyone can view book tropes" ON public.book_tropes FOR SELECT USING (TRUE);`,

  // Tags policies
  `CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (TRUE);`,

  // Book tags policies
  `CREATE POLICY "Anyone can view book tags" ON public.book_tags FOR SELECT USING (TRUE);`,

  // Reviews policies
  `CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (TRUE);`,
  `CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);`,

  // User preferences policies
  `CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);`,

  // Recent searches policies
  `CREATE POLICY "Users can view their own recent searches" ON public.recent_searches FOR SELECT USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can insert their own recent searches" ON public.recent_searches FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own recent searches" ON public.recent_searches FOR UPDATE USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can delete their own recent searches" ON public.recent_searches FOR DELETE USING (auth.uid() = user_id);`,

  // User reading stats policies
  `CREATE POLICY "Users can view their own reading stats" ON public.user_reading_stats FOR SELECT USING (auth.uid() = user_id);`,
  `CREATE POLICY "Users can insert their own reading stats" ON public.user_reading_stats FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update their own reading stats" ON public.user_reading_stats FOR UPDATE USING (auth.uid() = user_id);`,

  // User friends policies
  `CREATE POLICY "Users can view their own friend connections" ON public.user_friends FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);`,
  `CREATE POLICY "Users can insert their own friend requests" ON public.user_friends FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  `CREATE POLICY "Users can update friend status if they're involved" ON public.user_friends FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);`,
  `CREATE POLICY "Users can delete their own friend connections" ON public.user_friends FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);`,
];

// Create tables
async function createTables() {
  console.log('Creating tables...');
  for (const query of createTableQueries) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: query });
      if (error) {
        console.error('Error executing query:', error);
      } else {
        console.log('Query executed successfully');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// Set up RLS policies
async function setupRLSPolicies() {
  console.log('Setting up RLS policies...');
  for (const query of rlsPolicyQueries) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: query });
      if (error) {
        console.error('Error executing policy query:', error);
      } else {
        console.log('Policy query executed successfully');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// Main function to run the setup
async function main() {
  try {
    // Create the exec_sql function if it doesn't exist (requires admin privileges)
    const createFunction = `
      CREATE OR REPLACE FUNCTION exec_sql(query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE query;
      END;
      $$;
    `;
    
    // NOTE: The createFunction query may need to be executed by a database administrator
    // since it requires higher privileges than the anon key provides
    
    await createTables();
    await setupRLSPolicies();
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

main(); 