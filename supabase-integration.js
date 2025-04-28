import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://tuaugwdgynscaekexhsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YXVnd2RneW5zY2Fla2V4aHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Nzk1MjMsImV4cCI6MjA2MTM1NTUyM30.sK2RQd4vMbY6-kyQRXDPTYju33l12P90d8TbB9lmXjc';
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * User Management Functions
 */

// Register a new user
export async function signUp(email, password, username, fullName) {
  try {
    // First register with auth service
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    // Then create user profile if auth was successful
    if (authData?.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            username,
            email,
            password_hash: 'stored_in_auth',
            full_name: fullName,
            created_at: new Date()
          }
        ]);

      if (profileError) {
        throw profileError;
      }

      return { user: authData.user, profile: { username, full_name: fullName } };
    }
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Sign in user
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Get user profile data
    if (data?.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return { user: data.user, profile: profileData };
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign out user
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      return { user, profile: profileData };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Book Management Functions
 */

// Get all books
export async function getAllBooks() {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
}

// Get book by ID
export async function getBookById(bookId) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        chapters (*),
        book_genres (
          genres (*)
        ),
        book_tropes (
          tropes (*)
        ),
        book_tags (
          tags (*)
        )
      `)
      .eq('id', bookId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
}

// Search books
export async function searchBooks(query) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

/**
 * Reading List Management Functions
 */

// Get user's reading lists
export async function getUserReadingLists(userId) {
  try {
    const { data, error } = await supabase
      .from('reading_lists')
      .select(`
        *,
        reading_list_books (
          books (*)
        )
      `)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting reading lists:', error);
    throw error;
  }
}

// Create a reading list
export async function createReadingList(userId, name, description, isPublic = false) {
  try {
    const { data, error } = await supabase
      .from('reading_lists')
      .insert([
        {
          user_id: userId,
          name,
          description,
          is_public: isPublic
        }
      ])
      .select();
      
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error creating reading list:', error);
    throw error;
  }
}

// Add book to reading list
export async function addBookToReadingList(readingListId, bookId) {
  try {
    const { data, error } = await supabase
      .from('reading_list_books')
      .insert([
        {
          reading_list_id: readingListId,
          book_id: bookId
        }
      ]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding book to reading list:', error);
    throw error;
  }
}

/**
 * Bookmarks and Reading Progress Functions
 */

// Get user's bookmarks
export async function getUserBookmarks(userId) {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
}

// Add or update bookmark
export async function saveBookmark(userId, bookId, currentPage, notes = '') {
  try {
    // Check if bookmark already exists
    const { data: existingBookmark, error: checkError } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .maybeSingle();
      
    if (checkError) {
      throw checkError;
    }
    
    if (existingBookmark) {
      // Update existing bookmark
      const { error: updateError } = await supabase
        .from('user_bookmarks')
        .update({
          current_page: currentPage,
          notes,
          last_read_at: new Date(),
          updated_at: new Date()
        })
        .eq('id', existingBookmark.id);
        
      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new bookmark
      const { error: insertError } = await supabase
        .from('user_bookmarks')
        .insert([
          {
            user_id: userId,
            book_id: bookId,
            current_page: currentPage,
            notes,
            last_read_at: new Date()
          }
        ]);
        
      if (insertError) {
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    throw error;
  }
}

/**
 * Wishlist Management Functions
 */

// Get user's wishlist
export async function getUserWishlist(userId) {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    throw error;
  }
}

// Add book to wishlist
export async function addToWishlist(userId, bookId, notes = '') {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .insert([
        {
          user_id: userId,
          book_id: bookId,
          notes
        }
      ]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

/**
 * Genre, Trope and Tag Functions
 */

// Get all genres
export async function getAllGenres() {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting genres:', error);
    throw error;
  }
}

// Get all tropes
export async function getAllTropes() {
  try {
    const { data, error } = await supabase
      .from('tropes')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting tropes:', error);
    throw error;
  }
}

// Get all tags
export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting tags:', error);
    throw error;
  }
}

/**
 * User Preferences Functions
 */

// Get user preferences
export async function getUserPreferences(userId) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // No rows returned is not a real error
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
}

// Save user preferences
export async function saveUserPreferences(userId, preferences) {
  try {
    // Check if preferences exist
    const { data: existingPrefs, error: checkError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingPrefs) {
      // Update existing preferences
      const { error: updateError } = await supabase
        .from('user_preferences')
        .update({
          ...preferences,
          updated_at: new Date()
        })
        .eq('id', existingPrefs.id);
        
      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new preferences
      const { error: insertError } = await supabase
        .from('user_preferences')
        .insert([
          {
            user_id: userId,
            ...preferences
          }
        ]);
        
      if (insertError) {
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
} 