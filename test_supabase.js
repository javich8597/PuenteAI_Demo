import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase Connection...');
  
  // 1. Try to sign up a dummy user
  const email = `testuser_${Date.now()}@demo.com`;
  const password = 'testpassword123';
  
  console.log(`Signing up with ${email}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    console.error('Sign up error:', authError);
    return;
  }
  
  console.log('Sign up success! Session exists:', !!authData.session);
  
  if (authData.user) {
    console.log('Inserting into profiles...');
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: authData.user.id, name: 'Test User', avatar: 'T' }
    ]);
    
    if (profileError) {
      console.error('Profile insert error:', profileError);
    } else {
      console.log('Profile insert success!');
    }
  }
}

testSupabase();
