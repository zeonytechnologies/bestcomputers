import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const { data: isValid, error: rpcError } = await supabase.rpc('verify_and_update_password', {
      p_email: email,
      p_otp: otp,
      p_new_password: newPassword
    });

    if (rpcError) throw rpcError;

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP and update password' });
  }
}
