import { NextResponse } from 'next/server';

// Webhook handler for Farcaster events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event } = body;

    console.log('Received webhook event:', event);

    switch (event) {
      case 'miniapp_added':
        // Handle mini app added
        console.log('Mini app added:', body.notificationDetails);
        // Store notification token in your database
        break;

      case 'miniapp_removed':
        // Handle mini app removed
        console.log('Mini app removed');
        // Remove notification token from your database
        break;

      case 'notifications_enabled':
        // Handle notifications enabled
        console.log('Notifications enabled:', body.notificationDetails);
        // Store notification token
        break;

      case 'notifications_disabled':
        // Handle notifications disabled
        console.log('Notifications disabled');
        // Mark notifications as disabled
        break;

      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
