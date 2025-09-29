// app/api/events/[id]/registrations/bulk/route.js
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
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, registrationIds, pointsToAward } = await request.json();

    if (!action || !registrationIds || registrationIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let updateData = {};
    let results = { success: 0, failed: 0 };

    switch (action) {
      case 'approve':
        updateData = { status: 'approved', approvedAt: new Date() };
        break;
      case 'decline':
        updateData = { status: 'declined' };
        break;
      case 'check-in':
        updateData = { status: 'checked-in', checkedInAt: new Date() };
        break;
      case 'award-points':
        if (!pointsToAward || pointsToAward <= 0) {
          return NextResponse.json({ error: 'Invalid points amount' }, { status: 400 });
        }
        updateData = { 
          pointsAwarded: pointsToAward, 
          pointsAwardedAt: new Date() 
        };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    for (const regId of registrationIds) {
      try {
        const registration = await Registration.findById(regId);
        if (!registration) {
          results.failed++;
          continue;
        }

        await Registration.findByIdAndUpdate(regId, updateData);

        // If awarding points, update user's green points
        if (action === 'award-points' && !registration.pointsAwarded) {
          await User.findByIdAndUpdate(
            registration.user,
            { $inc: { greenPoints: pointsToAward } }
          );
        }

        results.success++;
      } catch (error) {
        console.error(`Failed to update registration ${regId}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      message: `Bulk operation completed. ${results.success} successful, ${results.failed} failed.`,
      results,
    });
  } catch (error) {
    console.error('Bulk registration operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}