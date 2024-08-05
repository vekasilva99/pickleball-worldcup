// api/payments.js


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    //console.log(req)
    const {total}=req.body
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(total)*100, // Amount in cents ($350)
        currency: 'usd',
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    // Handle GET request, e.g., retrieving payment status
  }
}