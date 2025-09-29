import { NextResponse } from 'next/server';
import { BADGE_THRESHOLDS } from '@/utils/constants';

export async function GET() {
  try {
    const badges = BADGE_THRESHOLDS.map(badge => ({
      name: badge.name,
      icon: badge.icon,
      requiredPoints: badge.points,
      description: `Earn ${badge.points} green points to unlock this badge`
    }));
    
    return NextResponse.json({ badges });
  } catch (error) {
    console.error('Get badges error:', error);
    return NextResponse.json({ error: 'Failed to get badges' }, { status: 500 });
  }
}