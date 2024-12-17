import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { prices } from '@/app/resources/config/prices'
import User from '@/app/models/User'
import connectDB from '@/app/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

async function handleSubscriptionCancellation(event: any) {
  console.log('[EVENT] Subscription deleted:', event)
  const subscription = await stripe.subscriptions.retrieve(event.data.object.id)
  console.log('Cancelling Subscription: ', subscription)
  console.log('Cancelling for customer Customer ID: ', subscription.customer)
  const foundUser = await User.findOne({'payment.customerId': subscription.customer})
  console.log('Cancelling for User: ', foundUser.email)
  foundUser.payment.hasAccess = false;
  foundUser.payment.cancelledAt = new Date();
  await User.updateOne(foundUser);
}

async function handleCheckoutCompletion(event: any) {
  console.log('[EVENT] Checkout completed: ', event);
  const session = event.data.object as Stripe.Checkout.Session;
  
  const paymentLinkUrl = (await stripe.paymentLinks.retrieve(session.payment_link as string)).url;
  const priceConfig = prices.find(p => p.link === paymentLinkUrl);
  
  if (!priceConfig) {
    console.error('Price configuration not found for lnik:', paymentLinkUrl);
    return;
  }
  
  const customerEmail = session.customer_details?.email;
  const customerFirstName = session.customer_details?.name?.split(' ')[0];
  
  if (!customerEmail) {
    console.error('Customer email not found');
    return;
  }

  await connectDB();
  
  let user = await User.findOne({ email: customerEmail });
  
  if (!user) {
    user = await User.create({
      email: customerEmail,
      name: customerFirstName ? customerFirstName : ('Dog Owner ' + Math.floor(Math.random() * (1000 - 100 + 1) + 100)),
      passwordHash: '', // You might want to handle this differently
      emailConfirmed: true, // Since they paid, we can trust the email
    });
  }
  
  await User.findByIdAndUpdate(user._id, {
    payment: {
      priceId: priceConfig.priceId,
      customerId: session.customer,
      hasAccess: true,
      paidAt: new Date()
    }
  });

  console.log('Payment processed for user:', customerEmail);

  // TODO: send email
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_SECRET_KEY!
    )
    
    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompletion(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }
}

// Stripe webhooks need the raw body, so we need to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}