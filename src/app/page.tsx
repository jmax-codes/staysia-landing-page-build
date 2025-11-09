"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { PageLoadingSkeleton, PropertyCarouselSkeleton } from "@/components/LoadingSkeletons";

interface Property {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  nights: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
}

interface SearchFilters {
  location?: string;
  category?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  adults?: number;
  children?: number;
  pets?: number;
  rooms?: number;
}

export default function Home() {
  const { t } = useTranslation();
  const { isReady } = useTranslationContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [searchFilters]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch properties
      const propertyParams = new URLSearchParams();
      if (searchFilters.location) propertyParams.append("city", searchFilters.location);
      if (searchFilters.category && searchFilters.category !== "all") {
        propertyParams.append("type", searchFilters.category);
      }
      if (searchFilters.adults || searchFilters.children) {
        const totalGuests = (searchFilters.adults || 0) + (searchFilters.children || 0);
        propertyParams.append("adults", totalGuests.toString());
      }
      if (searchFilters.pets && searchFilters.pets > 0) {
        propertyParams.append("pets", "true");
      }
      if (searchFilters.rooms) {
        propertyParams.append("rooms", searchFilters.rooms.toString());
      }
      propertyParams.append("limit", "50");
      propertyParams.append("sortBy", "rating");

      const propertiesRes = await fetch(`/api/properties?${propertyParams}`);
      const propertiesData = await propertiesRes.json();
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  // Create 3 dynamic sections - group by different criteria
  const createDynamicSections = () => {
    if (properties.length === 0) return [];

    const sections: Array<{ title: string; properties: Property[] }> = [];

    // Section 1: Group by most popular city
    const cityGroups = properties.reduce((acc, property) => {
      if (!acc[property.city]) {
        acc[property.city] = [];
      }
      acc[property.city].push(property);
      return acc;
    }, {} as Record<string, Property[]>);

    const sortedCities = Object.entries(cityGroups)
      .sort(([, a], [, b]) => b.length - a.length);

    if (sortedCities.length > 0) {
      const [topCity, topCityProperties] = sortedCities[0];
      sections.push({
        title: t('sections.staysIn', { city: topCity }),
        properties: topCityProperties.slice(0, 12),
      });
    }

    // Section 2: Group by most popular type or second most popular city
    if (sortedCities.length > 1) {
      const [secondCity, secondCityProperties] = sortedCities[1];
      sections.push({
        title: t('sections.availableHomesIn', { city: secondCity }),
        properties: secondCityProperties.slice(0, 12),
      });
    } else {
      // If only one city, group by type instead
      const typeGroups = properties.reduce((acc, property) => {
        if (!acc[property.type]) {
          acc[property.type] = [];
        }
        acc[property.type].push(property);
        return acc;
      }, {} as Record<string, Property[]>);

      const sortedTypes = Object.entries(typeGroups)
        .sort(([, a], [, b]) => b.length - a.length);

      if (sortedTypes.length > 0) {
        const [topType, topTypeProperties] = sortedTypes[0];
        sections.push({
          title: `${topType}s`,
          properties: topTypeProperties.slice(0, 12),
        });
      }
    }

    // Section 3: Group by another criteria (third city or guest favorites)
    if (sortedCities.length > 2) {
      const [thirdCity, thirdCityProperties] = sortedCities[2];
      sections.push({
        title: t('sections.placesToStayIn', { city: thirdCity }),
        properties: thirdCityProperties.slice(0, 12),
      });
    } else {
      // Show guest favorites or highest rated
      const favorites = properties
        .filter(p => p.isGuestFavorite || p.rating >= 4.5)
        .slice(0, 12);
      
      if (favorites.length > 0) {
        sections.push({
          title: t('sections.guestFavorites'),
          properties: favorites,
        });
      }
    }

    return sections.slice(0, 3); // Ensure exactly 3 sections
  };

  const dynamicSections = createDynamicSections();

  // Show skeleton while translations are loading
  if (!isReady) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] animate-fade-in">
      <Header onSearch={handleSearch} />
      
      <main>
        {isLoading ? (
          <>
            <PropertyCarouselSkeleton />
            <PropertyCarouselSkeleton />
            <PropertyCarouselSkeleton />
          </>
        ) : (
          <>
            {/* 3 Dynamic Property Sections */}
            {dynamicSections.map((section, index) => (
              <PropertyCarousel
                key={`section-${index}`}
                title={section.title}
                properties={section.properties}
                type="property"
              />
            ))}

            {/* No results message */}
            {properties.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sections.noResultsFound')}
                </h2>
                <p className="text-gray-600">
                  {t('sections.tryAdjustingFilters')}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}