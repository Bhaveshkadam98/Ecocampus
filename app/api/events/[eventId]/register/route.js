// app/api/events/[eventId]/register/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET - Get event registrations (Admin only)
export async function GET(request, { params }) {
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

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Await params before using it
    const { eventId } = await params;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let filter = { event: eventId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('user', 'name email greenPoints')
      .populate('event', 'title date')
      .sort({ registeredAt: -1 });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Registrations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// POST - Register for event (User)
export async function POST(request, { params }) {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Await params before using it
    const { eventId } = await params;

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'published') {
      return NextResponse.json({ error: 'Event is not available for registration' }, { status: 400 });
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: decoded.userId,
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    // Check capacity
    const approvedCount = await Registration.countDocuments({
      event: eventId,
      status: 'approved',
    });

    const body = await request.json();
    
    let registrationStatus = 'pending';
    
    if (event.autoApproveRegistrations) {
      if (approvedCount < event.maxParticipants) {
        registrationStatus = 'approved';
      } else {
        registrationStatus = 'waitlisted';
      }
    }

    const registration = new Registration({
      event: eventId,
      user: decoded.userId,
      status: registrationStatus,
      ...body,
    });

    await registration.save();
    await registration.populate('user', 'name email');
    await registration.populate('event', 'title date');

    return NextResponse.json({
      message: `Successfully ${registrationStatus === 'approved' ? 'registered' : registrationStatus} for event`,
      registration,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register for event' },
      { status: 500 }
    );
  }
}