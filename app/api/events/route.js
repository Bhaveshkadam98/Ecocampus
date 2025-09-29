// app/api/events/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET - List all events (with filters)
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const upcoming = searchParams.get('upcoming');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    console.log('GET /api/events - Query params:', { status, category, upcoming, page, limit });

    let filter = {};
    
    // Check if user is admin
    let isAdmin = false;
    const token = getTokenFromRequest(request);
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded) {
          const user = await User.findById(decoded.userId);
          isAdmin = user && user.role === 'admin';
          console.log('User role:', user?.role, 'isAdmin:', isAdmin);
        }
      } catch (err) {
        console.log('Token verification failed:', err.message);
      }
    } else {
      console.log('No token provided');
    }
    
    // If not admin, only show published events
    if (!isAdmin) {
      filter.status = 'published';
      console.log('Non-admin user, filtering to published only');
    } else if (status && status !== 'all') {
      filter.status = status;
      console.log('Admin user, filtering by status:', status);
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      // For upcoming events, always show only published ones
      filter.status = 'published';
      console.log('Upcoming filter applied, date >=', new Date());
    }

    console.log('Final event filter:', filter);

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    console.log('Found events:', events.length);
    if (events.length > 0) {
      console.log('Event details:');
      events.forEach(event => {
        console.log(`- ${event.title}: status=${event.status}, date=${event.date}`);
      });
    }

    // Add approved registration count for each event
    const eventsWithCounts = events.map(event => {
      const eventObj = event.toObject();
      eventObj.approvedRegistrationCount = event.registrations 
        ? event.registrations.filter(reg => reg.status === 'approved').length 
        : 0;
      return eventObj;
    });

    const total = await Event.countDocuments(filter);

    return NextResponse.json({
      events: eventsWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event (Admin only)
export async function POST(request) {
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

    const body = await request.json();
    
    // Validate required fields
    const {
      title,
      description,
      date,
      location,
      maxParticipants,
      pointsReward = 0,
      category = 'other',
      status = 'draft',
    } = body;

    if (!title || !description || !date || !maxParticipants) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, date, maxParticipants' },
        { status: 400 }
      );
    }

    // Validate date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Validate maxParticipants
    if (!Number.isInteger(maxParticipants) || maxParticipants <= 0) {
      return NextResponse.json(
        { error: 'maxParticipants must be a positive integer' },
        { status: 400 }
      );
    }

    const eventData = {
      ...body,
      organizer: user._id,
      pointsReward: Math.max(0, pointsReward),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const event = new Event(eventData);
    await event.save();
    
    await event.populate('organizer', 'name email');

    return NextResponse.json({
      message: 'Event created successfully',
      event,
    }, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

// Add a catch-all handler to log unexpected requests
export async function PUT(request) {
  console.log('PUT request received at /api/events - this should go to /api/events/[eventId]');
  return NextResponse.json(
    { error: 'PUT requests should go to /api/events/[eventId]' },
    { status: 404 }
  );
}