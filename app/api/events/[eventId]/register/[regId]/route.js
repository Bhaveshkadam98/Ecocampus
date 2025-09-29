// app/api/registrations/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';
import Event from '@/models/Event';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// PUT - Update registration status (Admin only)
export async function PUT(request, { params }) {
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
    const { status, adminComment, pointsAwarded, checkedIn } = body;

    const registration = await Registration.findById(params.id);
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const updateData = { ...body };

    // Handle status changes
    if (status && status !== registration.status) {
      updateData.status = status;
      
      if (status === 'approved') {
        updateData.approvedAt = new Date();
      }
    }

    // Handle check-in
    if (checkedIn && !registration.checkedInAt) {
      updateData.status = 'checked-in';
      updateData.checkedInAt = new Date();
    }

    // Handle points awarding
    if (pointsAwarded && pointsAwarded > 0 && !registration.pointsAwarded) {
      updateData.pointsAwarded = pointsAwarded;
      updateData.pointsAwardedAt = new Date();
      
      // Update user's green points
      await User.findByIdAndUpdate(
        registration.user,
        { $inc: { greenPoints: pointsAwarded } }
      );
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email greenPoints')
     .populate('event', 'title date');

    return NextResponse.json({
      message: 'Registration updated successfully',
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error('Registration update error:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel registration
export async function DELETE(request, { params }) {
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

    const registration = await Registration.findById(params.id);
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    
    // Allow user to cancel their own registration or admin to cancel any
    if (registration.user.toString() !== decoded.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to cancel this registration' }, { status: 403 });
    }

    // If points were already awarded, we might want to deduct them
    if (registration.pointsAwarded > 0) {
      await User.findByIdAndUpdate(
        registration.user,
        { $inc: { greenPoints: -registration.pointsAwarded } }
      );
    }

    await Registration.findByIdAndDelete(params.id);

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

