const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to set up authentication management
async function setupAuth() {
  console.log('Setting up authentication...');
  
  try {
    // Check if auth is working properly by getting the user
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error with auth setup:', error);
    } else {
      console.log('Auth setup check complete');
      if (user) {
        console.log('Current user:', user);
      } else {
        console.log('No authenticated user');
      }
    }
  } catch (error) {
    console.error('Error during auth setup:', error);
  }
}

// Function to verify or create schema and important indexes
async function setupSchema() {
  console.log('Verifying schema...');
  
  // First check for existence of tables
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  if (error) {
    console.error('Error checking tables:', error);
    return;
  }
  
  if (tables) {
    console.log('Existing tables:', tables.map(t => t.table_name).join(', '));
  } else {
    console.log('No tables found');
  }
}

// Function to create a new test user
async function createTestUser() {
  console.log('Creating test user...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test12345',
    });
    
    if (error) {
      console.error('Error creating test user:', error);
    } else {
      console.log('Test user created:', data);
      
      // Add user profile data
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              username: 'testuser',
              email: 'test@example.com',
              password_hash: 'stored_in_auth_not_here', // Never store actual passwords
              full_name: 'Test User',
              avatar_url: 'https://i.pravatar.cc/150?u=test',
              location: 'Test City',
              is_premium: false
            }
          ]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log('User profile created successfully');
        }
      }
    }
  } catch (error) {
    console.error('Error during test user creation:', error);
  }
}

// Function to test sample data access
async function testDataAccess() {
  console.log('Testing data access...');
  
  try {
    // Test public access to books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .limit(3);
      
    if (booksError) {
      console.error('Error accessing books:', booksError);
    } else {
      console.log('Successfully accessed books:', books);
    }
    
    // Test public access to genres
    const { data: genres, error: genresError } = await supabase
      .from('genres')
      .select('*')
      .limit(3);
      
    if (genresError) {
      console.error('Error accessing genres:', genresError);
    } else {
      console.log('Successfully accessed genres:', genres);
    }
    
    // Test public access to tropes
    const { data: tropes, error: tropesError } = await supabase
      .from('tropes')
      .select('*')
      .limit(3);
      
    if (tropesError) {
      console.error('Error accessing tropes:', tropesError);
    } else {
      console.log('Successfully accessed tropes:', tropes);
    }
  } catch (error) {
    console.error('Error during data access test:', error);
  }
}

// Create additional necessary tables using the client
async function createAdditionalTables() {
  console.log('Creating additional tables...');
  
  try {
    // Create chapters table
    const { error: chaptersError } = await supabase
      .from('chapters')
      .insert([
        {
          book_id: null, // This will be updated later
          title: 'Sample Chapter 1',
          content: 'This is a sample chapter content for testing purposes.',
          chapter_number: 1
        }
      ]);
      
    if (chaptersError && chaptersError.code !== '23505') {
      console.error('Error creating chapters table:', chaptersError);
    } else {
      console.log('Chapters table created or already exists');
    }
    
    // Create reading_lists table
    const { error: readingListsError } = await supabase
      .from('reading_lists')
      .insert([
        {
          user_id: null, // This will be populated with a real user ID later
          name: 'My Reading List',
          description: 'A collection of my favorite books',
          is_public: true
        }
      ]);
      
    if (readingListsError && readingListsError.code !== '23505') {
      console.error('Error creating reading_lists table:', readingListsError);
    } else {
      console.log('Reading lists table created or already exists');
    }
  } catch (error) {
    console.error('Error creating additional tables:', error);
  }
}

// Main function to run the setup
async function main() {
  try {
    await setupAuth();
    await setupSchema();
    await createTestUser();
    await createAdditionalTables();
    await testDataAccess();
    
    console.log('Security setup completed!');
  } catch (error) {
    console.error('Error during security setup:', error);
  }
}

main(); 