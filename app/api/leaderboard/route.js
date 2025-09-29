import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const leaders = await User.find({ greenPoints: { $gt: 0 } })
      .select('name greenPoints badges')
      .sort('-greenPoints')
      .limit(10);
    
    return NextResponse.json({ leaders });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
  }
}