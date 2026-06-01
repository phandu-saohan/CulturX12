import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerInfo } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.qty,
    }));

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/?checkout=cancelled`,
      customer_email: customerInfo?.email,
      metadata: {
        customerName: customerInfo?.name,
        customerPhone: customerInfo?.phone,
        shippingAddress: customerInfo?.address,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
