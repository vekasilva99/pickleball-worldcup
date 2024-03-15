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
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f8f8;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .container img{
                width:4rem;
                height:4rem;
                object-fit:contain;
              }
              h1 {
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
              }
              p {
                color: #555555;
                margin-bottom: 10px;
              }
              a {
                color: #007bff;
                text-decoration: none;
              }
              .button {
                display: inline-block;
                background-color: #EFB810;
                color: #000 !important;
                border-radius: 4px;
                padding: 10px 20px;
                margin-top: 20px;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
            <div style="background:#000; width:100%;height:fit-content;display:flex;align-items:center;padding:1rem;    border-radius: 1rem;">
            <img src="https://firebasestorage.googleapis.com/v0/b/pickleball-worldcup.appspot.com/o/World%20Cup%20-%20Web%20HOME_logo%20menu%20bar.webp?alt=media&token=5c348fb9-4b86-4702-ba9c-eff4301acd5c" />
            </div>  
            <h1>Welcome to the Pickleball World Cup!</h1>
              <p>You have been invited to participate by ${coordinator} to represent ${country}.</p>
              <p>Your username: ${email}</p>
              <a class="button" href="${link}">Set up your account</a>
            </div>
          </body>
        </html>
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
