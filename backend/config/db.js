const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Query wrapper that mimics pg Pool interface using Supabase
async function query(text, params) {
  // Parse the query to determine table and operation
  const lowerText = text.toLowerCase();
  
  // Handle SELECT * FROM users WHERE id = $1
  if (lowerText.includes('select') && lowerText.includes('from users') && lowerText.includes('where id')) {
    const { data, error } = await supabase.from('users').select('*').eq('id', params[0]).single();
    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  }
  
  // Handle SELECT uploads for user
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('where user_id')) {
    const { data, error } = await supabase.from('uploads').select('*').eq('user_id', params[0]).order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }
  
  // Handle SELECT all uploads
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('order by')) {
    const { data, error } = await supabase.from('uploads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }
  
  // Handle SELECT all users
  if (lowerText.includes('select') && lowerText.includes('from users') && lowerText.includes('order by')) {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }
  
  // Handle INSERT INTO uploads
  if (lowerText.includes('insert into uploads')) {
    const { data, error } = await supabase.from('uploads').insert({
      user_id: params[0],
      file_path: params[1],
      tier: params[2] || 'Basic',
      instructions: params[3] || ''
    }).select().single();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }
  
  // Handle UPDATE users total_uploads
  if (lowerText.includes('update users') && lowerText.includes('total_uploads')) {
    const { data: current, error: fetchError } = await supabase.from('users').select('total_uploads').eq('id', params[1]).single();
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    const newTotal = (current?.total_uploads || 0) + params[0];
    const { data, error } = await supabase.from('users').update({ 
      total_uploads: newTotal, 
      updated_at: new Date().toISOString() 
    }).eq('id', params[1]).select().single();
    
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }
  
  // Handle UPDATE uploads status
  if (lowerText.includes('update uploads') && lowerText.includes('status')) {
    const id = params.find((_, i) => text.includes(`$${i + 1}`) && text.toLowerCase().includes('where')) || params[params.length - 1];
    const status = params[0];
    const editedFilePath = params.length > 1 ? params[1] : undefined;
    
    const updateData = { status, updated_at: new Date().toISOString() };
    if (editedFilePath) updateData.edited_file_path = editedFilePath;
    
    const { data, error } = await supabase.from('uploads').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }
  
  throw new Error(`Unsupported query: ${text.substring(0, 50)}`);
}

module.exports = {
  query,
  supabase
};
