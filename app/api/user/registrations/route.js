// app/api/user/registrations/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET - Get user's registrations
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    let filter = { user: decoded.userId };
    if (eventId) {
      filter.event = eventId;
    }

    if (eventId) {
      // Single event registration check
      const registration = await Registration.findOne(filter)
        .populate('event', 'title date status')
        .populate('user', 'name email');
      
      return NextResponse.json({ registration });
    } else {
      // All user registrations
      const registrations = await Registration.find(filter)
        .populate('event', 'title date status location pointsReward')
        .sort({ registeredAt: -1 });

      return NextResponse.json({ registrations });
    }
  } catch (error) {
    console.error('User registrations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel user registration
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Check if user owns this registration
    if (registration.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Not authorized to cancel this registration' }, { status: 403 });
    }

    // Check if event has already started
    const event = await Event.findById(registration.event);
    if (event && new Date() > new Date(event.date)) {
      return NextResponse.json({ error: 'Cannot cancel registration for past events' }, { status: 400 });
    }

    // If points were already awarded, deduct them
    if (registration.pointsAwarded > 0) {
      await User.findByIdAndUpdate(
        decoded.userId,
        { $inc: { greenPoints: -registration.pointsAwarded } }
      );
    }

    await Registration.findByIdAndDelete(registrationId);

    return NextResponse.json({
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Registration cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    );
  }
}