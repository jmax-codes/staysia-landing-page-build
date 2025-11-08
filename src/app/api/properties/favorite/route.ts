import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // Validate ID is provided
    if (!id) {
      return NextResponse.json(
        { 
          error: 'Valid property ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Validate ID is a positive integer
    const propertyId = parseInt(id);
    if (isNaN(propertyId) || propertyId <= 0) {
      return NextResponse.json(
        { 
          error: 'Valid property ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Fetch current property
    const existingProperty = await db.select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    // Check if property exists
    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const currentProperty = existingProperty[0];

    // Toggle isGuestFavorite status
    const newFavoriteStatus = !currentProperty.isGuestFavorite;

    // Update property with new favorite status and updatedAt
    const updatedProperty = await db.update(properties)
      .set({
        isGuestFavorite: newFavoriteStatus,
        updatedAt: new Date().toISOString()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    return NextResponse.json(updatedProperty[0], { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}