import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, like, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const city = searchParams.get('city');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single property by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(property[0], { status: 200 });
    }

    // Filter by city with pagination
    if (city) {
      const filteredProperties = await db
        .select()
        .from(properties)
        .where(sql`lower(${properties.city}) = lower(${city})`)
        .limit(limit)
        .offset(offset);

      return NextResponse.json(filteredProperties, { status: 200 });
    }

    // Return all properties with pagination
    const allProperties = await db
      .select()
      .from(properties)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(allProperties, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, area, type, price, rating, imageUrl, nights, isGuestFavorite } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!city || typeof city !== 'string' || city.trim() === '') {
      return NextResponse.json(
        { error: 'City is required and must be a non-empty string', code: 'INVALID_CITY' },
        { status: 400 }
      );
    }

    if (!area || typeof area !== 'string' || area.trim() === '') {
      return NextResponse.json(
        { error: 'Area is required and must be a non-empty string', code: 'INVALID_AREA' },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json(
        { error: 'Type is required and must be a non-empty string', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Validate price
    if (price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive integer', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { error: 'Rating is required', code: 'MISSING_RATING' },
        { status: 400 }
      );
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 0 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    // Validate nights (optional, default to 2)
    let nightsNum = 2;
    if (nights !== undefined && nights !== null) {
      nightsNum = parseInt(nights);
      if (isNaN(nightsNum) || nightsNum <= 0) {
        return NextResponse.json(
          { error: 'Nights must be a positive integer', code: 'INVALID_NIGHTS' },
          { status: 400 }
        );
      }
    }

    // Validate isGuestFavorite (optional, default to false)
    const isGuestFavoriteValue = isGuestFavorite === true || isGuestFavorite === 1 ? true : false;

    const timestamp = new Date().toISOString();

    // Insert new property
    const newProperty = await db
      .insert(properties)
      .values({
        name: name.trim(),
        city: city.trim(),
        area: area.trim(),
        type: type.trim(),
        price: priceNum,
        nights: nightsNum,
        rating: ratingNum,
        imageUrl: imageUrl.trim(),
        isGuestFavorite: isGuestFavoriteValue,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}