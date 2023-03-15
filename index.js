const stripe = require('stripe')('sk_test_51MSiMCLutRiIN1666JLcAEhyd9YhxCeIXuXDjqHpT1HSxqMpcu3a4tSvWwBjZsGLoAvhSlte3iivTX7Avci5WjUJ00PzFQCp2g');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
app.use(express.json())

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.price * 100,
      currency: 'eur',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51MSiMCLutRiIN166MnCfrWJPJSxxK5PhrLHKSYh6WaTKV4oiIm2myQGPluomaofSMkxg1d4J9u2k0iMXefh0RnV600Dds5Mgo3'
    });
  } catch (error) {
    console.log(error);
  }

});

app.listen(port, () => {
  console.log('server running')
})