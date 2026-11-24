import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db, ensureSeeded } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/guard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['owner']);
    if (!auth.authenticated) {
      return auth.response;
    }

    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const requestedTable = searchParams.get('table');

    // Fetch live data for tables
    const [
      tenantsList,
      usersList,
      staffList,
      schedulesList,
      servicesList,
      bookingsList,
      recallsList,
      webhooksList,
    ] = await Promise.all([
      db.query.tenants.findMany(),
      db.query.users.findMany(),
      db.query.staff.findMany(),
      db.query.staffSchedules.findMany(),
      db.query.services.findMany(),
      db.query.bookings.findMany({ orderBy: [desc(bookings.createdAt)] }),
      db.query.recallReminders.findMany(),
      db.query.webhookEvents.findMany(),
    ]);

    // Sanitize user passwords for display
    const safeUsers = usersList.map((u: any) => ({
      ...u,
      passwordHash: u.passwordHash ? `${u.passwordHash.substring(0, 14)}... (bcrypt)` : null,
    }));

    const allTablesData = {
      tenants: tenantsList,
      users: safeUsers,
      staff: staffList,
      staffSchedules: schedulesList,
      services: servicesList,
      bookings: bookingsList,
      recallReminders: recallsList,
      webhookEvents: webhooksList,
    };

    const tableCounts = {
      tenants: tenantsList.length,
      users: safeUsers.length,
      staff: staffList.length,
      staffSchedules: schedulesList.length,
      services: servicesList.length,
      bookings: bookingsList.length,
      recallReminders: recallsList.length,
      webhookEvents: webhooksList.length,
    };

    if (requestedTable && requestedTable in allTablesData) {
      return NextResponse.json({
        success: true,
        table: requestedTable,
        count: (allTablesData as any)[requestedTable].length,
        rows: (allTablesData as any)[requestedTable],
        counts: tableCounts,
      });
    }

    return NextResponse.json({
      success: true,
      tables: allTablesData,
      counts: tableCounts,
      engine: 'PostgreSQL / PGlite (WASM) via Drizzle ORM',
    });
  } catch (error) {
    console.error('[GET /api/v1/system/db Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Database query failed' },
      { status: 500 }
    );
  }
}
