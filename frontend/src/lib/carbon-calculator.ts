// Simplified carbon footprint calculation based on cloud usage patterns
import { awsCarbonService, EnhancedCarbonResult } from './aws-carbon-service';

export interface CarbonCalculationResult {
  co2eTons: number
  kilowattHours: number
  cost: number
  isRealData?: boolean
  breakdown?: {
    compute: number;
    storage: number;
    networking: number;
    memory: number;
  };
}

export async function calculateAWSCarbonFootprint(
  monthlySpend: number,
  serviceCategory: string,
  region: string = 'us-east-1'
): Promise<CarbonCalculationResult> {
  try {
    // Use the AWS Carbon Footprint Service (real data when configured)
    const result = await awsCarbonService.calculateCarbonFootprint(monthlySpend, serviceCategory, region);
    
    return {
      co2eTons: result.co2eTons,
      kilowattHours: result.kilowattHours,
      cost: result.cost,
      isRealData: result.isRealData,
      breakdown: result.breakdown
    };
  } catch (error) {
    console.error('Carbon footprint calculation error:', error)
    
    // Fallback calculation if service fails
    return {
      co2eTons: Math.round((monthlySpend * 0.0001) * 100) / 100,
      kilowattHours: Math.round((monthlySpend * 2.1) * 100) / 100,
      cost: monthlySpend,
      isRealData: false
    }
  }
}

function estimateUsageFromSpend(spend: number, serviceCategory: string): number {
  // Estimated resource usage based on monthly spend
  const spendMultipliers: Record<string, number> = {
    compute: 2000, // Instance hours
    storage: 10000, // GB storage
    database: 1500, // DB hours
    networking: 5000, // Data transfer GB
    serverless: 100000, // Function invocations
    'ai-ml': 500, // Model inference hours
    analytics: 1000, // Processing jobs
    security: 800 // Security events processed
  }
  
  return spend * (spendMultipliers[serviceCategory] || 1000)
}

function getEnergyMultiplier(serviceCategory: string): number {
  // kWh per unit of usage by service type
  const energyMultipliers: Record<string, number> = {
    compute: 0.05, // kWh per instance hour
    storage: 0.001, // kWh per GB
    database: 0.08, // kWh per DB hour
    networking: 0.002, // kWh per GB transferred
    serverless: 0.0001, // kWh per invocation
    'ai-ml': 0.15, // kWh per inference hour
    analytics: 0.12, // kWh per processing job
    security: 0.01 // kWh per security event
  }
  
  return energyMultipliers[serviceCategory] || 0.05
}

function getCarbonIntensityByRegion(region: string): number {
  // CO2 grams per kWh by AWS region (approximate values)
  const carbonIntensity: Record<string, number> = {
    'us-east-1': 429, // Virginia
    'us-west-2': 350, // Oregon
    'eu-west-1': 316, // Ireland
    'ap-southeast-1': 431, // Singapore
    'ap-northeast-1': 518, // Tokyo
    'eu-central-1': 338, // Frankfurt
    'us-west-1': 345, // California
    'ap-south-1': 631, // Mumbai
    'ca-central-1': 130 // Canada Central
  }
  
  return carbonIntensity[region] || 400 // Default average
}

export function formatCarbonResult(result: CarbonCalculationResult, unit: string = 'tons'): string {
  const suffix = result.isRealData ? ' (AWS Data)' : ' (Estimated)';
  
  switch (unit) {
    case 'kg':
      return `${(result.co2eTons * 1000).toFixed(1)} kg CO₂e${suffix}`;
    case 'lbs':
      return `${(result.co2eTons * 2204.62).toFixed(1)} lbs CO₂e${suffix}`;
    case 'tons':
    default:
      if (result.co2eTons < 0.01) {
        return `${(result.co2eTons * 1000).toFixed(1)} kg CO₂e${suffix}`;
      }
      return `${result.co2eTons.toFixed(2)} tons CO₂e${suffix}`;
  }
}

// Carbon comparison calculations
export interface CarbonComparison {
  flights: {
    domesticFlights: number
    internationalFlights: number
  }
  phones: {
    smartphoneYears: number
    phoneCharges: number
  }
  cars: {
    milesDriven: number
    gasoline: number // gallons
  }
}

export function getCarbonComparisons(co2eTons: number): CarbonComparison {
  // Average carbon footprints for comparison
  const domesticFlightCO2 = 0.255 // tons CO2e per domestic flight (round trip)
  const internationalFlightCO2 = 2.3 // tons CO2e per international flight (round trip)
  const smartphoneYearCO2 = 0.07 // tons CO2e per smartphone per year
  const phoneChargeCO2 = 0.0000084 // tons CO2e per phone charge
  const carMileCO2 = 0.000404 // tons CO2e per mile driven (average car)
  const gasolineCO2 = 0.0089 // tons CO2e per gallon of gasoline

  return {
    flights: {
      domesticFlights: Math.round(co2eTons / domesticFlightCO2),
      internationalFlights: Math.round(co2eTons / internationalFlightCO2 * 10) / 10
    },
    phones: {
      smartphoneYears: Math.round(co2eTons / smartphoneYearCO2 * 10) / 10,
      phoneCharges: Math.round(co2eTons / phoneChargeCO2)
    },
    cars: {
      milesDriven: Math.round(co2eTons / carMileCO2),
      gasoline: Math.round(co2eTons / gasolineCO2 * 10) / 10
    }
  }
}

// Currency formatting utility
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹'
  };

  const symbol = currencySymbols[currency] || currency + ' ';
  
  if (currency === 'JPY' || currency === 'CNY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toLocaleString()}`;
}