import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB via RPC
    const { data: isValidEmail, error: rpcError } = await supabase.rpc('set_admin_otp', {
      p_email: email,
      p_otp: otp
    });

    if (rpcError) throw rpcError;

    if (!isValidEmail) {
      // Return 200 anyway to prevent email enumeration, but we don't actually send email.
      return res.status(200).json({ success: true, message: 'If the email exists, an OTP was sent.' });
    }

    // Send email via NodeMailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Best Computers Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Password Reset OTP — Best Computers`,
      text: `Your password reset OTP is: ${otp}\n\nIt expires in 15 minutes.`,
      html: `<h2>Password Reset Request</h2><p>Your OTP is: <strong style="font-size:24px; letter-spacing: 2px;">${otp}</strong></p><p>It expires in 15 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ error: 'Failed to process OTP request' });
  }
}
