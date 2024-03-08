// pages/api/send-email.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // If the request method is not POST, return a 405 Method Not Allowed response
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, coordinator, country,link } = req.body;

  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'vekasilva99@gmail.com',
        pass: 'tjpn mcyr vbze fypz',
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: 'vekasilva99@gmail.com',
      to: email,
      subject: 'Welcome to the Pickleball World Cup!',
      html: `
      <h1>Welcome to the Pickleball World Cup!</h1>
      <p>You have been invited to participate by ${coordinator} to represent ${country}.</p>
      <p>Your username: ${email}</p>
      <p>Click on this link to set up your account: ${link}</p>
      `,
    });

    // Log success and send a response
    //console.log('Email sent: ', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Log error and send an error response
    console.error('Error sending email: ', error);
    res.status(500).json({ error: 'Error sending email' });
  }
}
