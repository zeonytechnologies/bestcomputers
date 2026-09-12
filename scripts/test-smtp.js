import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim();
  }
});

// Since the email is @gmail.com but the host is smtp.hostinger.com, it might fail.
// I will try what is provided first.
const host = env.SMTP_USER.includes('@gmail.com') && env.SMTP_HOST === 'smtp.hostinger.com' 
  ? 'smtp.gmail.com' // Auto-correct for testing if it's obviously gmail
  : env.SMTP_HOST;

console.log(`Connecting to SMTP Host: ${host}`);

const transporter = nodemailer.createTransport({
  host: host,
  port: parseInt(env.SMTP_PORT),
  secure: env.SMTP_SECURE === 'true',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function main() {
  try {
    console.log('Attempting to send test email...');
    const info = await transporter.sendMail({
      from: `"Best Computers Admin" <${env.SMTP_USER}>`,
      to: env.NOTIFY_EMAIL,
      subject: 'Test Email - Best Computers',
      text: 'Hello! Your SMTP configuration is working perfectly.',
      html: '<b>Hello!</b> Your SMTP configuration is working perfectly.'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    if (host === 'smtp.gmail.com' && env.SMTP_HOST === 'smtp.hostinger.com') {
      console.log('\n⚠️ NOTE: You used a @gmail.com address but set the host to smtp.hostinger.com.');
      console.log('I auto-corrected it to smtp.gmail.com for this test.');
      console.log('Please update your .env.local and Supabase dashboard to use smtp.gmail.com');
    }
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error);
  }
}

main();
