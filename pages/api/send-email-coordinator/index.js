
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // If the request method is not POST, return a 405 Method Not Allowed response
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, coordinator,link } = req.body;

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
              font-size:16px;
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
              margin-top: 10px;
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
          <img style=" width:100%;display:flex;align-items:center;border-radius: 1rem;height:auto;" class="banner" src="https://firebasestorage.googleapis.com/v0/b/pickleball-worldcup.appspot.com/o/2403%20World%20Cup%20-%20mailing%20TEAM%20CORDINATOR-04.png?alt=media&token=3390f59d-315f-43bb-bcef-b7e20a3262f7" />
   <div style="width:100%; text-align:left;margin-top:20px;">
         <p>Dear ${coordinator},</p>
            <p>We are excited to extend our congratulations on your selection as the Team Coordinator for your delegation.</p>
            <p>As the Team Coordinator, you will play the role in ensuring the success of your delegation.</p>
            <p style="margin-bottom:0">Please find your username for the registration below:</p>
            <p style="margin-top:0">Your username: ${email}</p>
            <a class="button" href="${link}">Set up your account</a>
            <p>Wishing you the best of luck and can't wait to see you there!</p>
            <p style="margin-bottom:0">Warm regards,</p>           
             <p style="margin-top:0">Hercilio Cabieses</p>
             </div>
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