import { db } from '@/db';
import { propertyPricing } from '@/db/schema';

async function main() {
    const currentDate = new Date();
    const currentTimestamp = currentDate.toISOString();
    
    // Base prices for properties (in IDR thousands)
    const propertyBasePrices: Record<number, number> = {
        // Luxury tier (1-10)
        1: 4500, 2: 4200, 3: 3800, 4: 3500, 5: 3200,
        6: 2800, 7: 2500, 8: 2200, 9: 1800, 10: 1500,
        // Mid-tier (11-20)
        11: 2200, 12: 2000, 13: 1800, 14: 1600, 15: 1400,
        16: 1200, 17: 1000, 18: 900, 19: 800, 20: 700,
        // Standard tier (21-30)
        21: 1800, 22: 1600, 23: 1400, 24: 1200, 25: 1000,
        26: 900, 27: 800, 28: 700, 29: 600, 30: 500
    };

    const pricingData = [];

    // Generate pricing for 30 properties, 90 days each
    for (let propertyId = 1; propertyId <= 30; propertyId++) {
        const basePrice = propertyBasePrices[propertyId];
        
        // Create status distribution for 90 days
        const statusDistribution = [
            ...Array(54).fill('available'),      // 60%
            ...Array(18).fill('best_deal'),      // 20%
            ...Array(13).fill('peak_season'),    // 15%
            ...Array(5).fill('sold_out')         // 5%
        ];

        // Shuffle the status array for randomness
        for (let i = statusDistribution.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [statusDistribution[i], statusDistribution[j]] = [statusDistribution[j], statusDistribution[i]];
        }

        // Generate 90 days of pricing
        for (let day = 0; day < 90; day++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + day);
            const dateStr = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;

            // Get status for this day with weekend bias
            let status = statusDistribution[day];
            
            // Apply weekend bias while maintaining overall distribution
            if (isWeekend && Math.random() > 0.7) {
                if (status === 'available' && day < 85) {
                    // Find next available peak_season or sold_out to swap
                    for (let swap = day + 1; swap < 90; swap++) {
                        if (!isWeekend && (statusDistribution[swap] === 'peak_season' || statusDistribution[swap] === 'sold_out')) {
                            [statusDistribution[day], statusDistribution[swap]] = [statusDistribution[swap], statusDistribution[day]];
                            status = statusDistribution[day];
                            break;
                        }
                    }
                }
            }

            // Calculate price based on status
            let price = basePrice;
            if (status === 'best_deal') {
                const discount = 0.65 + Math.random() * 0.15; // 0.65 to 0.80
                price = Math.round(basePrice * discount);
            } else if (status === 'peak_season') {
                const premium = 1.25 + Math.random() * 0.25; // 1.25 to 1.50
                price = Math.round(basePrice * premium);
            }

            pricingData.push({
                propertyId,
                roomId: null,
                date: dateStr,
                price,
                status,
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
            });
        }
    }

    await db.insert(propertyPricing).values(pricingData);
    
    console.log('✅ Property pricing seeder completed successfully');
    console.log(`   Generated ${pricingData.length} pricing records for 30 properties over 90 days`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});