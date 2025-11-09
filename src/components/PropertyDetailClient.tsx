"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Star, 
  MapPin,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingCalendar } from "@/components/PricingCalendar";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";

interface PropertyData {
  property: {
    id: number;
    name: string;
    city: string;
    area: string;
    type: string;
    description: string;
    address: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    petsAllowed: boolean;
    checkInTime: string;
    checkOutTime: string;
    price: number;
    nights: number;
    rating: number;
    imageUrl: string;
    images: string[];
    amenities: string[];
  };
  rooms: Array<{
    id: number;
    name: string;
    type: string;
    pricePerNight: number;
    maxGuests: number;
    beds: Record<string, number>;
    size: number;
    amenities: string[];
    available: boolean;
  }>;
  reviews: Array<{
    id: number;
    userName: string;
    userAvatar: string | null;
    rating: number;
    comment: string;
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
    createdAt: string;
  }>;
  pricing: Array<{
    id: number;
    date: string;
    price: number;
    status: string;
  }>;
}

interface PropertyDetailClientProps {
  data: PropertyData;
}

export function PropertyDetailClient({ data }: PropertyDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { property, rooms, reviews, pricing } = data;
  const [selectedImage, setSelectedImage] = useState(0);
  const { selectedCurrency, exchangeRate } = useCurrency();

  const images = property.images || [property.imageUrl];

  const formatPrice = (price: number) => {
    const converted = price * exchangeRate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const formatBeds = (beds: Record<string, number>) => {
    const bedTypes = Object.entries(beds)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${count} ${type}`);
    return bedTypes.join(", ");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-100 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('propertyDetail.back')}</span>
          </button>
        </div>
      </div>

      {/* Main Content with proper spacing from navbar */}
      <div className="pt-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              <span className="font-semibold">{property.rating.toFixed(2)}</span>
              <span className="text-gray-600">({reviews.length} {reviews.length === 1 ? t('propertyDetail.review') : t('propertyDetail.reviews')})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
          <div className="relative h-[400px] lg:h-[500px]">
            <Image
              src={images[selectedImage]}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative h-[195px] lg:h-[245px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedImage(idx + 1)}
              >
                <Image
                  src={img}
                  alt={`${property.name} ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {property.type} {t('propertyDetail.in')} {property.area}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>{property.maxGuests} {t('propertyDetail.guests')}</span>
                <span>•</span>
                <span>{property.bedrooms} {t('propertyDetail.bedrooms')}</span>
                <span>•</span>
                <span>{property.bathrooms} {t('propertyDetail.bathrooms')}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('propertyDetail.whatThisPlaceOffers')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            {rooms.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('propertyDetail.availableRooms')}
                </h2>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-[#FFB400] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {room.name}
                          </h3>
                          <p className="text-sm text-gray-600">{room.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(room.pricePerNight)}
                          </p>
                          <p className="text-sm text-gray-600">{t('propertyDetail.perNight')}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span>{room.maxGuests} {t('propertyDetail.guests')}</span>
                        <span>•</span>
                        <span>{room.size} m²</span>
                        <span>•</span>
                        <span>{formatBeds(room.beds)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {room.available ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">
                                {t('propertyDetail.available')}
                              </span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">
                                {t('propertyDetail.notAvailable')}
                              </span>
                            </>
                          )}
                        </div>
                        <Button
                          disabled={!room.available}
                          className="bg-[#FFB400] hover:bg-[#e5a200] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('propertyDetail.bookNow')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <Star className="w-6 h-6 inline fill-gray-900 text-gray-900 mr-2" />
                  {property.rating.toFixed(2)} • {reviews.length} {reviews.length === 1 ? t('propertyDetail.review') : t('propertyDetail.reviews')}
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          {review.userAvatar ? (
                            <Image
                              src={review.userAvatar}
                              alt={review.userName}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-gray-600">
                              {review.userName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                              <span className="text-sm font-semibold">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Pricing Calendar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingCalendar
                propertyId={property.id}
                pricingData={pricing}
                basePrice={property.price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}