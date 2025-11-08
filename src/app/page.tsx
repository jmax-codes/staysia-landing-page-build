import { Header } from "@/components/Header";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import { Footer } from "@/components/Footer";

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

async function getProperties(city?: string): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = city
      ? `${baseUrl}/api/properties?city=${encodeURIComponent(city)}`
      : `${baseUrl}/api/properties`;
    
    const response = await fetch(url, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function Home() {
  const jakartaProperties = await getProperties("Jakarta");
  const tangerangProperties = await getProperties("Kabupaten Tangerang");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main>
        {/* Jakarta Properties */}
        {jakartaProperties.length > 0 && (
          <PropertyCarousel
            title="Popular homes in Jakarta"
            properties={jakartaProperties}
          />
        )}

        {/* Tangerang Properties */}
        {tangerangProperties.length > 0 && (
          <PropertyCarousel
            title="Available in Kabupaten Tangerang this weekend"
            properties={tangerangProperties}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}