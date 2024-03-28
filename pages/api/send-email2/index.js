
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // If the request method is not POST, return a 405 Method Not Allowed response
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, coordinator, country, link } = req.body;

  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'c2609024.ferozo.com',
      port: 465,
      secure: true,
      auth: {
        user: 'worldcup@cabiesesfoundation.com',
        pass: 'on*/7ev5nK',
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: 'worldcup@cabiesesfoundation.com',
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
              text-align:center;
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

            .banner{
      
              height: auto;
              width:100%;
        
            }
          
          </style>
        </head>
        <body>
          <div class="container">
          <img style=" width:100%;display:flex;align-items:center;border-radius: 1rem;height:auto;" class="banner" src="https://firebasestorage.googleapis.com/v0/b/pickleball-worldcup.appspot.com/o/2403-World-Cup---mailing-web.png?alt=media&token=db0dfe3e-03e7-4167-b659-6c3690774a1f" />
   
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
    console.log('Email sent: ', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Log error and send an error response
    console.error('Error sending email: ', error);
    res.status(500).json({ error: 'Error sending email' });
  }
}