const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Check Supabase connection on startup
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Supabase connection FAILED:', error.message);
    } else {
      console.log('✅ Supabase connected successfully!');
    }
  } catch (err) {
    console.error('❌ Supabase connection FAILED:', err.message);
  }
})();

// Query wrapper that mimics pg Pool interface using Supabase
async function query(text, params) {
  const lowerText = text.toLowerCase().trim();

  // ==========================================
  // SELECT QUERIES
  // ==========================================

  // SELECT * FROM users WHERE id = $1
  if (lowerText.includes('select') && lowerText.includes('from users') && lowerText.includes('where id')) {
    const { data, error } = await supabase.from('users').select('*').eq('id', params[0]).single();
    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  }

  // SELECT * FROM users WHERE role = $1 (used by /admin/admins)
  if (lowerText.includes('select') && lowerText.includes('from users') && lowerText.includes("where role")) {
    const roleValue = params && params.length > 0 ? params[0] : 'admin';
    const { data, error } = await supabase.from('users').select('*').eq('role', roleValue);
    if (error) throw error;
    return { rows: data || [] };
  }

  // SELECT uploads for user (user's uploads)
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('where user_id')) {
    const { data, error } = await supabase.from('uploads').select('*').eq('user_id', params[0]).order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }

  // SELECT uploads WHERE assigned_admin = $1 (admin's assigned tasks)
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('where assigned_admin')) {
    const { data, error } = await supabase.from('uploads').select('*').eq('assigned_admin', params[0]).order('created_at', { ascending: true });
    if (error) throw error;
    return { rows: data || [] };
  }

  // SELECT uploads WHERE id = $1 AND assigned_admin = $2 (ownership check)
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('where') && lowerText.includes('assigned_admin') && lowerText.includes('id')) {
    const { data, error } = await supabase.from('uploads').select('*').eq('id', params[0]).eq('assigned_admin', params[1]);
    if (error) throw error;
    return { rows: data || [] };
  }

  // SELECT role FROM users WHERE id = $1 (role check middleware)
  if (lowerText.includes('select') && lowerText.includes('role') && lowerText.includes('from users') && lowerText.includes('where id')) {
    const { data, error } = await supabase.from('users').select('role').eq('id', params[0]).single();
    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  }

  // JOIN query: SELECT ... FROM uploads u JOIN users us ON ... ORDER BY (superadmin all-uploads)
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('join') && lowerText.includes('users')) {
    const { data, error } = await supabase
      .from('uploads')
      .select('*, users!uploads_user_id_fkey(email)')
      .order('created_at', { ascending: false });
    if (error) {
      // Fallback: try without the foreign key name
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });
      if (fallbackError) throw fallbackError;

      // Manually enrich with user emails
      const enriched = [];
      for (const upload of (fallbackData || [])) {
        let userEmail = 'Unknown';
        try {
          const { data: userData } = await supabase.from('users').select('email').eq('id', upload.user_id).single();
          if (userData) {
            userEmail = userData.email;
          }
        } catch (e) { /* ignore */ }
        enriched.push({ ...upload, user_email: userEmail });
      }
      return { rows: enriched };
    }
    // Map the nested user data to flat fields
    const mapped = (data || []).map(row => ({
      ...row,
      user_email: row.users?.email || 'Unknown',
      users: undefined, // Remove nested object
    }));
    return { rows: mapped };
  }

  // SELECT all uploads (generic)
  if (lowerText.includes('select') && lowerText.includes('from uploads') && lowerText.includes('order by')) {
    const { data, error } = await supabase.from('uploads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }

  // SELECT all users ordered
  if (lowerText.includes('select') && lowerText.includes('from users') && lowerText.includes('order by')) {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { rows: data || [] };
  }

  // ==========================================
  // INSERT QUERIES
  // ==========================================

  // INSERT INTO uploads
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

  // ==========================================
  // UPDATE QUERIES
  // ==========================================

  // UPDATE uploads SET assigned_admin = $1, status = 'assigned' WHERE id = $2
  if (lowerText.includes('update uploads') && lowerText.includes('assigned_admin')) {
    const updateData = {
      assigned_admin: params[0],
      status: 'assigned',
      updated_at: new Date().toISOString()
    };
    const uploadId = params[1];
    const { data, error } = await supabase.from('uploads').update(updateData).eq('id', uploadId).select().single();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }

  // UPDATE uploads SET edited_file_path = $1, status = 'reviewing' WHERE id = $2
  if (lowerText.includes('update uploads') && lowerText.includes('edited_file_path')) {
    const updateData = {
      edited_file_path: params[0],
      status: 'reviewing',
      updated_at: new Date().toISOString()
    };
    const uploadId = params[1];
    const { data, error } = await supabase.from('uploads').update(updateData).eq('id', uploadId).select().single();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }

  // UPDATE uploads SET status = $1 WHERE id = $2 (approve/generic status change)
  if (lowerText.includes('update uploads') && lowerText.includes('status') && !lowerText.includes('assigned_admin') && !lowerText.includes('edited_file_path')) {
    const status = params[0];
    const uploadId = params[params.length - 1]; // Last param is typically the id
    const updateData = { status, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('uploads').update(updateData).eq('id', uploadId).select().single();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }

  // UPDATE users SET total_uploads = total_uploads + $1 WHERE id = $2
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

  // UPDATE users SET role = $1 WHERE email = $2 (change-role)
  if (lowerText.includes('update users') && lowerText.includes('role') && lowerText.includes('where email')) {
    const { data, error } = await supabase
      .from('users')
      .update({ role: params[0], updated_at: new Date().toISOString() })
      .eq('email', params[1])
      .select('id, email, role')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  }

  throw new Error(`Unsupported query: ${text.substring(0, 80)}`);
}

module.exports = {
  query,
  supabase
};
