import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message, productName } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Enquiry — ${name}`,
      text: `New Enquiry Received
      
Name: ${name}
Phone: ${phone}
Product: ${productName || 'General enquiry'}
Message: ${message || '-'}
Timestamp: ${new Date().toLocaleString()}
      `,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('SMTP Error:', error);
    // Don't surface SMTP errors to the client, but return 500 so they know it failed if they need to.
    // The prompt says "Return a clear success/failure JSON response; log failures server-side but never surface SMTP errors to the customer"
    res.status(500).json({ error: 'Failed to send notification email' });
  }
}
