import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const activities = await Activity.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort('-createdAt');
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Get pending activities error:', error);
    return NextResponse.json({ error: 'Failed to get activities' }, { status: 500 });
  }
}