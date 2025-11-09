import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, reviews } from '@/db/schema';
import { eq, like, sql, and, gte, lte, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const pets = searchParams.get('pets');
    const roomsParam = searchParams.get('rooms');
    const sortBy = searchParams.get('sortBy') || 'name';
    const search = searchParams.get('search');
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

    // Build filters array
    const filters = [];
    
    if (city) {
      filters.push(sql`lower(${properties.city}) = lower(${city})`);
    }
    
    if (type) {
      filters.push(sql`lower(${properties.type}) = lower(${type})`);
    }
    
    if (minPrice) {
      const minPriceNum = parseInt(minPrice);
      if (!isNaN(minPriceNum)) {
        filters.push(gte(properties.price, minPriceNum));
      }
    }
    
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      if (!isNaN(maxPriceNum)) {
        filters.push(lte(properties.price, maxPriceNum));
      }
    }
    
    if (adults || children) {
      const totalGuests = (parseInt(adults || '0') || 0) + (parseInt(children || '0') || 0);
      if (totalGuests > 0) {
        filters.push(gte(properties.maxGuests, totalGuests));
      }
    }
    
    if (pets === 'true') {
      filters.push(eq(properties.petsAllowed, true));
    }
    
    if (roomsParam) {
      const roomsNum = parseInt(roomsParam);
      if (!isNaN(roomsNum) && roomsNum > 0) {
        filters.push(gte(properties.bedrooms, roomsNum));
      }
    }
    
    if (search) {
      filters.push(
        sql`lower(${properties.name}) LIKE lower(${'%' + search + '%'})`
      );
    }

    // Build query - prioritize Indonesian properties
    let query = db.select().from(properties);
    
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }
    
    // Apply sorting with Indonesian priority
    if (sortBy === 'price_asc') {
      query = query.orderBy(
        sql`CASE WHEN lower(${properties.country}) = 'indonesia' THEN 0 ELSE 1 END`,
        asc(properties.price)
      );
    } else if (sortBy === 'price_desc') {
      query = query.orderBy(
        sql`CASE WHEN lower(${properties.country}) = 'indonesia' THEN 0 ELSE 1 END`,
        desc(properties.price)
      );
    } else if (sortBy === 'rating') {
      query = query.orderBy(
        sql`CASE WHEN lower(${properties.country}) = 'indonesia' THEN 0 ELSE 1 END`,
        desc(properties.rating)
      );
    } else {
      // Default: prioritize Indonesia first, then sort by name
      query = query.orderBy(
        sql`CASE WHEN lower(${properties.country}) = 'indonesia' THEN 0 ELSE 1 END`,
        asc(properties.name)
      );
    }
    
    const results = await query.limit(limit).offset(offset);

    // For each property, fetch review count and calculate average rating
    const propertiesWithReviews = await Promise.all(
      results.map(async (property) => {
        const propertyReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.propertyId, property.id));

        const reviewCount = propertyReviews.length;
        const avgRating = reviewCount > 0
          ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
          : property.rating;

        return {
          ...property,
          rating: avgRating,
          reviewCount,
        };
      })
    );

    return NextResponse.json(propertiesWithReviews, { status: 200 });
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
    const { name, city, area, type, price, rating, imageUrl, nights, isGuestFavorite, 
            description, address, country, latitude, longitude, bedrooms, bathrooms, 
            maxGuests, petsAllowed, checkInTime, checkOutTime, images, amenities } = body;

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
        description: description?.trim() || null,
        address: address?.trim() || null,
        country: country?.trim() || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        maxGuests: maxGuests ? parseInt(maxGuests) : null,
        petsAllowed: petsAllowed === true || petsAllowed === 1 ? true : false,
        checkInTime: checkInTime?.trim() || null,
        checkOutTime: checkOutTime?.trim() || null,
        images: images || null,
        amenities: amenities || null,
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