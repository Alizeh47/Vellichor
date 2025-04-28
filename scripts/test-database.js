const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection and check if tables exist
async function testDatabase() {
  console.log('=== Testing Supabase Database Connection ===');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Check database health
    console.log('\n--- Database Connection Test ---');
    const { error: healthError } = await supabase.from('books').select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('Database connection error:', healthError);
    } else {
      console.log('Database connection: SUCCESS');
    }
    
    // Test each table
    const tables = [
      'users',
      'books',
      'chapters',
      'user_bookmarks',
      'reading_lists',
      'reading_list_books',
      'wishlist',
      'genres',
      'book_genres',
      'tropes',
      'book_tropes',
      'tags',
      'book_tags',
      'reviews',
      'user_preferences',
      'recent_searches',
      'user_reading_stats',
      'user_friends'
    ];
    
    console.log('\n--- Table Access Tests ---');
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          console.log(`Table '${table}': FAIL - ${error.message}`);
        } else {
          console.log(`Table '${table}': SUCCESS (Count: ${count})`);
        }
      } catch (error) {
        console.log(`Table '${table}': ERROR - ${error.message}`);
      }
    }
    
    // Test simple read access for public tables
    console.log('\n--- Read Access Tests ---');
    
    try {
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('*')
        .limit(5);
        
      if (booksError) {
        console.log('Read books: FAIL -', booksError.message);
      } else {
        console.log(`Read books: SUCCESS (${books.length} rows)`);
        if (books.length > 0) {
          console.log('Sample book:', books[0]);
        }
      }
    } catch (error) {
      console.log('Read books: ERROR -', error.message);
    }
    
    try {
      const { data: genres, error: genresError } = await supabase
        .from('genres')
        .select('*')
        .limit(5);
        
      if (genresError) {
        console.log('Read genres: FAIL -', genresError.message);
      } else {
        console.log(`Read genres: SUCCESS (${genres.length} rows)`);
        if (genres.length > 0) {
          console.log('Sample genre:', genres[0]);
        }
      }
    } catch (error) {
      console.log('Read genres: ERROR -', error.message);
    }
  } catch (error) {
    console.error('General test error:', error);
  }
  
  console.log('\n=== Testing Complete ===');
}

// Run the test
testDatabase(); 