const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create the users table directly with the API
async function createUsersTable() {
  try {
    console.log('Creating users table...');
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: 'admin',
          email: 'admin@example.com',
          password_hash: 'placeholder_hash',
          full_name: 'System Administrator',
          is_premium: true
        }
      ]);
    
    if (error) {
      if (error.code === '23505') { // Duplicate key error
        console.log('Users table already exists');
      } else {
        console.error('Error creating users table:', error);
      }
    } else {
      console.log('Users table created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the books table and insert sample data
async function createBooksTable() {
  try {
    console.log('Creating books table and adding sample data...');
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: 'The Here And Now',
          author: 'Jillian Lawrence',
          cover_image_url: 'fantasy_book1.jpg',
          description: 'A thought-provoking journey through time and space, exploring the concept of living in the present moment while reconciling with the past.',
          total_pages: 320
        },
        {
          title: 'Silent Echo',
          author: 'Maya Rivers',
          cover_image_url: 'fantasy_book2.jpg',
          description: 'When a mysterious sound phenomenon appears in a small coastal town, a young scientist must uncover its secrets before it consumes everything.',
          total_pages: 280
        },
        {
          title: 'The Stranger In The Lake',
          author: 'Sloane Collins',
          cover_image_url: 'crime_book1.jpg',
          description: 'A chilling tale of a body discovered in a peaceful mountain lake, and the dark secrets that emerge as a small town detective digs deeper.',
          total_pages: 350
        }
      ]);
    
    if (error) {
      if (error.code === '23505') { // Duplicate key error
        console.log('Books table already exists with data');
      } else {
        console.error('Error creating books table:', error);
      }
    } else {
      console.log('Books table created successfully with sample data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the genres table and insert sample data
async function createGenresTable() {
  try {
    console.log('Creating genres table and adding sample data...');
    const { data, error } = await supabase
      .from('genres')
      .insert([
        {
          name: 'Crime & Mystery',
          description: 'Books involving criminal cases, detectives, and puzzle-solving',
          cover_image_url: 'genres/crime.jpg'
        },
        {
          name: 'Science Fiction',
          description: 'Speculative fiction exploring futuristic concepts, technology, and space',
          cover_image_url: 'genres/scifi.jpg'
        },
        {
          name: 'Romance',
          description: 'Stories focused on romantic relationships and emotional fulfillment',
          cover_image_url: 'genres/romance.jpg'
        },
        {
          name: 'Fantasy',
          description: 'Fiction featuring magical elements, mythical creatures, and imaginary worlds',
          cover_image_url: 'genres/fantasy.jpg'
        },
        {
          name: 'Horror',
          description: 'Stories designed to frighten, scare, or startle the reader',
          cover_image_url: 'genres/horror.jpg'
        }
      ]);
    
    if (error) {
      if (error.code === '23505') { // Duplicate key error
        console.log('Genres table already exists with data');
      } else {
        console.error('Error creating genres table:', error);
      }
    } else {
      console.log('Genres table created successfully with sample data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the tropes table and insert sample data
async function createTropesTable() {
  try {
    console.log('Creating tropes table and adding sample data...');
    const { data, error } = await supabase
      .from('tropes')
      .insert([
        {
          name: 'Enemies to Lovers',
          description: 'Characters who start as adversaries develop romantic feelings over time',
          color: '#916F5E'
        },
        {
          name: 'Grumpy x Sunshine',
          description: 'A pairing between a pessimistic character and an optimistic one',
          color: '#005A74'
        },
        {
          name: 'Found Family',
          description: 'Characters with little or no blood relation form deep familial bonds',
          color: '#623D33'
        },
        {
          name: 'Secret Royal',
          description: 'A character discovers they have royal heritage or is hiding royal status',
          color: '#B39285'
        },
        {
          name: 'The Chosen One',
          description: 'A character destined to fulfill a prophecy or special purpose',
          color: '#C78E65'
        }
      ]);
    
    if (error) {
      if (error.code === '23505') { // Duplicate key error
        console.log('Tropes table already exists with data');
      } else {
        console.error('Error creating tropes table:', error);
      }
    } else {
      console.log('Tropes table created successfully with sample data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the tags table and insert sample data
async function createTagsTable() {
  try {
    console.log('Creating tags table and adding sample data...');
    const { data, error } = await supabase
      .from('tags')
      .insert([
        {
          name: 'Main Character Meltdowns',
          color: '#916F5E',
          icon: 'heart-broken'
        },
        {
          name: 'Angst But Make It Pretty',
          color: '#25323A',
          icon: 'band-aid'
        },
        {
          name: 'Soft Magic & Sharp Morals',
          color: '#B39285',
          icon: 'book-dead'
        },
        {
          name: 'Read This With a Blanket and Tea',
          color: '#25323A',
          icon: 'swords'
        },
        {
          name: 'Whispers Between Pages',
          color: '#917E78',
          icon: 'wolf-pack-battalion'
        }
      ]);
    
    if (error) {
      if (error.code === '23505') { // Duplicate key error
        console.log('Tags table already exists with data');
      } else {
        console.error('Error creating tags table:', error);
      }
    } else {
      console.log('Tags table created successfully with sample data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Main function to run the setup
async function main() {
  try {
    await createUsersTable();
    await createBooksTable();
    await createGenresTable();
    await createTropesTable();
    await createTagsTable();
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

main(); 