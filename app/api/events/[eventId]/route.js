// app/api/events/[eventId]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Get single event
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { eventId } = params;
    console.log('GET request for event ID:', eventId);

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId)
      .populate('organizer', 'name email')
      .populate('registrations.user', 'name email');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user can view this event
    let canView = event.status === 'published';
    
    const token = getTokenFromRequest(request);
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded) {
          const user = await User.findById(decoded.userId);
          if (user && user.role === 'admin') {
            canView = true;
          }
        }
      } catch (err) {
        // Continue with canView as is
      }
    }

    if (!canView) {
      return NextResponse.json(
        { error: 'Event not found or not published' },
        { status: 404 }
      );
    }

    // Add approved registration count
    const eventObj = event.toObject();
    eventObj.approvedRegistrationCount = event.registrations 
      ? event.registrations.filter(reg => reg.status === 'approved').length 
      : 0;

    return NextResponse.json({ event: eventObj });
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    
    const { eventId } = params;
    console.log('PUT request for event ID:', eventId);

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid event ID format:', eventId);
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const token = getTokenFromRequest(request);
    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      console.log('User not admin:', user?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found in database:', eventId);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log('Update request body:', body);
      console.log('Update request body type:', typeof body);
      console.log('Update request body keys:', Object.keys(body));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      console.log('Invalid body type:', typeof body);
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 }
      );
    }

    // Validate fields if they are being updated
    if (body.date !== undefined) {
      const eventDate = new Date(body.date);
      if (isNaN(eventDate.getTime())) {
        console.log('Invalid date:', body.date);
        return NextResponse.json(
          { error: `Invalid date format: ${body.date}` },
          { status: 400 }
        );
      }
    }

    if (body.maxParticipants !== undefined) {
      const maxParticipants = Number(body.maxParticipants);
      if (!Number.isInteger(maxParticipants) || maxParticipants <= 0) {
        console.log('Invalid maxParticipants:', body.maxParticipants);
        return NextResponse.json(
          { error: `maxParticipants must be a positive integer, received: ${body.maxParticipants}` },
          { status: 400 }
        );
      }
      body.maxParticipants = maxParticipants;
    }

    if (body.pointsReward !== undefined) {
      const pointsReward = Number(body.pointsReward);
      if (isNaN(pointsReward)) {
        console.log('Invalid pointsReward:', body.pointsReward);
        return NextResponse.json(
          { error: `pointsReward must be a number, received: ${body.pointsReward}` },
          { status: 400 }
        );
      }
      body.pointsReward = Math.max(0, pointsReward);
    }

    // Validate status if being updated
    if (body.status !== undefined) {
      const validStatuses = ['draft', 'published', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        console.log('Invalid status:', body.status);
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate category if being updated
    if (body.category !== undefined) {
      const validCategories = ['tree-planting', 'cleanup', 'workshop', 'collection-drive', 'competition', 'awareness', 'other'];
      if (!validCategories.includes(body.category)) {
        console.log('Invalid category:', body.category);
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Update the event
    try {
      console.log('Attempting to update event with ID:', eventId);
      console.log('Update data:', body);
      
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { 
          ...body, 
          updatedAt: new Date() 
        },
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('organizer', 'name email');

      if (!updatedEvent) {
        return NextResponse.json(
          { error: 'Event not found after update' },
          { status: 404 }
        );
      }

      console.log('Event updated successfully. New status:', updatedEvent.status);

      return NextResponse.json({
        message: 'Event updated successfully',
        event: updatedEvent,
      });
    } catch (updateError) {
      console.error('MongoDB update error:', updateError);
      if (updateError.name === 'ValidationError') {
        const errors = Object.values(updateError.errors).map(err => err.message);
        return NextResponse.json(
          { error: `Validation error: ${errors.join(', ')}` },
          { status: 400 }
        );
      }
      throw updateError;
    }
  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { eventId } = params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

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

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Event deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}