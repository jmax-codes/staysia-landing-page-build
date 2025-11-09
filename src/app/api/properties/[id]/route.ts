import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, rooms, reviews, propertyPricing } from '@/db/schema';
import { eq, gte, lte, desc, asc, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid property ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const propertyId = parseInt(id);

    if (propertyId <= 0) {
      return NextResponse.json(
        {
          error: 'Property ID must be a positive integer',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Fetch property
    const propertyResult = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (propertyResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Property not found',
          code: 'PROPERTY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const property = propertyResult[0];

    // Fetch rooms for this property
    const propertyRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.propertyId, propertyId));

    // Fetch reviews for this property
    const propertyReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.createdAt));

    // Auto-calculate rating average from reviews
    const avgRating = propertyReviews.length > 0
      ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) / propertyReviews.length
      : property.rating;

    // Fetch pricing data for next 60 days
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 60);
    const endDateString = endDate.toISOString().split('T')[0];

    const pricingData = await db
      .select()
      .from(propertyPricing)
      .where(
        and(
          eq(propertyPricing.propertyId, propertyId),
          gte(propertyPricing.date, startDate),
          lte(propertyPricing.date, endDateString)
        )
      )
      .orderBy(asc(propertyPricing.date));

    // Return comprehensive property details with calculated rating
    return NextResponse.json({
      property: {
        ...property,
        rating: avgRating,
      },
      rooms: propertyRooms,
      reviews: propertyReviews,
      pricing: pricingData,
    });
  } catch (error) {
    console.error('GET property error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}