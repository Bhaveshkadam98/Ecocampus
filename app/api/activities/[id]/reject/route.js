import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { comment } = await request.json();
    
    await connectToDatabase();
    
    // Check if user is admin
    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    if (activity.status !== 'pending') {
      return NextResponse.json({ error: 'Activity already processed' }, { status: 400 });
    }
    
    // Update activity
    activity.status = 'rejected';
    activity.adminComment = comment;
    await activity.save();
    
    return NextResponse.json({ 
      message: 'Activity rejected',
      activity 
    });
  } catch (error) {
    console.error('Reject activity error:', error);
    return NextResponse.json({ error: 'Failed to reject activity' }, { status: 500 });
  }
}