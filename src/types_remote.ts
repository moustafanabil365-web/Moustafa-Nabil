export type GroupType = 
  | 'family_kids' 
  | 'couples_honeymoon' 
  | 'friends_youth' 
  | 'solo_traveler' 
  | 'business_leisure';

export type TravelStyle = 
  | 'spiritual_pilgrimage'
  | 'relaxation_nature' 
  | 'history_culture' 
  | 'adventure_thrills' 
  | 'luxury_shopping' 
  | 'budget_backpacking' 
  | 'culinary_foodie' 
  | 'kids_entertainment'
  | 'authentic_local';

export type DialectPreference = 
  | 'saudi_gulf' 
  | 'egyptian' 
  | 'modern_standard_arabic';

export type TransitMode = 
  | 'optimal' 
  | 'high_speed_train' 
  | 'domestic_flight' 
  | 'rental_car' 
  | 'bus_coach';

export interface CityStop {
  id: string;
  cityName: string;
  days: number;
  hotelArea?: string;
}

export interface TravelConstraints {
  destination: string;
  durationDays: number;
  groupType: GroupType;
  budget: number | string;
  currency: string;
  travelStyle: TravelStyle;
  accommodationArea: string;
  specialConstraints: string;
  dialect: DialectPreference;
  // Multi-city extensions
  isMultiCity?: boolean;
  cityStops?: CityStop[];
  preferredTransit?: TransitMode;
  includeLocalHiddenGems?: boolean;
}

export interface LocalExperience {
  id: string;
  title: string;
  category: 'culinary' | 'artisan' | 'neighborhood_walk' | 'cultural_heritage';
  categoryLabel: string;
  location: string;
  estimatedCost: string;
  duration: string;
  description: string;
  whyNonTouristy: string;
  insiderTip: string;
  recommendedTime: string;
}

export interface TravelAlert {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'info';
  type: 'flight' | 'train' | 'weather' | 'traffic' | 'attraction';
  affectedLocation: string;
  description: string;
  impact: string;
  suggestedAction: string;
  timestamp: string;
  isResolved?: boolean;
}

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'landmark' | 'hotel' | 'food' | 'gem' | 'transit' | 'city_stop';
  categoryLabel?: string;
  dayIndex?: number;
  cityName?: string;
  description?: string;
  recommendedTime?: string;
  insiderTip?: string;
}

export interface MapRouteLeg {
  fromCity: string;
  toCity: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  transitMode?: string;
  duration?: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  weatherCode: number;
  icon: string;
  precipitationProb: number;
}

export interface ClothingRecommendation {
  summary: string;
  daytimeOutfit: string;
  eveningOutfit: string;
  essentialAccessories: string[];
  shoesRecommendation: string;
  rainOrSunWarning?: string;
}

export interface WeatherData {
  destination: string;
  currentTemp: number;
  apparentTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
  forecast: DayForecast[];
  clothingRecommendations: ClothingRecommendation;
  updatedAt: string;
}

export interface RestaurantItem {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  priceLabel: string;
  rating: number;
  reviewCount?: number;
  estimatedCostPerPerson: string;
  nearLandmark?: string;
  addressArea: string;
  signatureDishes: string[];
  description: string;
  dietaryTags?: string[];
  atmosphere: string;
  recommendedMeal: 'breakfast' | 'lunch' | 'dinner' | 'cafe_dessert';
  googleMapsQuery: string;
}

export interface ActivityNote {
  id: string;
  activityKey: string; // e.g. "day-1-morning", "day-2-hotel"
  dayNumber: number;
  activityTitle?: string;
  noteText: string;
  bookingNumber?: string;
  ticketRef?: string;
  reminderTime?: string;
  createdAt: string;
}

export type ReminderCategory = 'booking' | 'transit' | 'docs' | 'luggage' | 'finance' | 'health' | 'other';
export type ReminderPriority = 'high' | 'medium' | 'low';

export interface TravelReminder {
  id: string;
  tripId?: string;
  title: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  category: ReminderCategory;
  priority: ReminderPriority;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
  alertBeforeHours?: number; // e.g., 24, 48, 72 hours before travel or due date
  notifyBrowser?: boolean;
  alertTriggered?: boolean;
}

export interface DayVisualLandmark {
  dayNumber: number;
  dayTitle: string;
  landmarkName: string;
  city?: string;
  description: string;
  imageUrl?: string;
  photoTip?: string;
  bestTime?: string;
  isGenerating?: boolean;
  generatedBy?: 'imagen' | 'fallback' | 'custom';
}

export interface CurrencyRateInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateAgainstUSD: number; // 1 USD = rate
}

export interface CustomDayNote {
  dayIndex: number;
  customTime?: string;
  customActivity?: string;
  personalNotes?: string;
}

export interface CollaboratorComment {
  id: string;
  shareId: string;
  dayNumber?: number;
  activityKey?: string;
  activityTitle?: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  voteScore?: number;
  votedUserIds?: string[];
  createdAt: string;
}

// 1. Trip Quality Score & Optimization
export interface TripQualityRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'balance' | 'budget' | 'pacing' | 'comfort';
  impact: string;
  suggestedAction?: string;
}

export interface TripQualityEvaluation {
  overallScore: number; // 0 - 10
  scores: {
    activityBalance: number;
    budgetEfficiency: number;
    intensityPacing: number;
    comfortSafety: number;
  };
  verdict: string;
  strengths: string[];
  recommendations: TripQualityRecommendation[];
  evaluatedAt: string;
}

// 2. Live Expense Tracker
export type ExpenseCategory = 
  | 'accommodation' 
  | 'dining' 
  | 'activities' 
  | 'transit' 
  | 'shopping' 
  | 'emergency' 
  | 'other';

export interface TripExpenseItem {
  id: string;
  dayNumber?: number;
  date?: string; // YYYY-MM-DD
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  notes?: string;
  createdAt: string;
}

// 3. Smart Packing Templates & Weather Check
export type PackingTemplateId = 
  | 'city_culture' 
  | 'beach_resort' 
  | 'winter_ski' 
  | 'business_conf' 
  | 'adventure_hiking' 
  | 'family_kids' 
  | 'backpacking_light';

export interface PackingItem {
  id: string;
  title: string;
  category: 'clothing' | 'footwear' | 'electronics' | 'toiletries' | 'documents' | 'special_gear';
  categoryLabel: string;
  isPacked: boolean;
  quantity?: string;
  weatherReason?: string;
  isCustom?: boolean;
  dueDate?: string; // Optional specific date to prepare/pack this item
  notes?: string;
}

export interface PackingListState {
  templateId: PackingTemplateId;
  items: PackingItem[];
  customReminders?: TravelReminder[];
  tripDepartureDate?: string;
  weatherAlerts?: string[];
  lastUpdated: string;
}

// 4. Eco-Impact Tracker
export interface EcoSustainableAlternative {
  title: string;
  description: string;
  co2SavedKg: number;
  ecoTip: string;
}

export interface EcoImpactCalculation {
  totalCarbonKg: number;
  carbonPerDayKg: number;
  ecoGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  gradeLabel: string;
  breakdown: {
    transit: number;
    accommodation: number;
    activities: number;
    food: number;
  };
  sustainableAlternatives: EcoSustainableAlternative[];
  treesToOffset: number;
  calculatedAt: string;
}

// 5. User Feedback & Star Rating
export interface TripUserFeedback {
  rating: number; // 1 to 5 stars
  likedAspects: string[]; // e.g. 'itinerary_pacing', 'budget_accuracy', 'local_gems', 'weather_relevance', 'packing_smartness'
  reviewComment?: string;
  categoryRatings?: {
    accuracy: number; // 1 to 5
    variety: number; // 1 to 5
    budgetMatch: number; // 1 to 5
  };
  submittedAt: string;
}

// 6. Destination Health & Safety Advisories
export interface HealthAdvisoryItem {
  id: string;
  type: 'health' | 'vaccine' | 'water_food' | 'safety' | 'pharmacy';
  title: string;
  severity: 'normal' | 'advisory' | 'warning';
  description: string;
  recommendation: string;
}

export interface DestinationHealthAdvisory {
  destination: string;
  safetyLevel: 1 | 2 | 3 | 4; // 1: Exercise Normal Precautions, 2: Exercise Increased Caution, 3: Reconsider Travel, 4: Do Not Travel
  safetyLevelLabel: string;
  tapWaterSafe: boolean;
  tapWaterNote: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    general: string;
  };
  requiredVaccines: string[];
  recommendedVaccines: string[];
  healthItems: HealthAdvisoryItem[];
  medicalFacilityNote: string;
  lastUpdated: string;
}

export interface GeneratedPlan {
  id: string;
  destination: string;
  durationDays: number;
  constraints: TravelConstraints;
  itineraryMarkdown: string;
  generatedAt: string;
  title?: string;
  localExperiences?: LocalExperience[];
  activeAlerts?: TravelAlert[];
  mapPoints?: MapPoint[];
  weather?: WeatherData;
  customNotes?: Record<number, string>;
  activityNotes?: Record<string, ActivityNote>;
  reminders?: TravelReminder[];
  dayLandmarks?: DayVisualLandmark[];
  collaboratorComments?: CollaboratorComment[];
  tripStartDate?: string; // YYYY-MM-DD for progress tracking
  shareId?: string;
  isUserModified?: boolean;
  tripQualityEvaluation?: TripQualityEvaluation;
  expenses?: TripExpenseItem[];
  packingState?: PackingListState;
  ecoImpact?: EcoImpactCalculation;
  userFeedback?: TripUserFeedback;
  translatedItineraries?: Record<string, string>; // language code -> translated markdown (e.g. 'en', 'fr', 'es')
  healthAdvisories?: DestinationHealthAdvisory;
}

export interface VisualPlaceCard {
  name: string;
  category: 'landmark' | 'restaurant' | 'cafe' | 'nature' | 'heritage' | 'activity' | 'city';
  categoryLabel?: string;
  imageUrl: string;
  rating?: number;
  priceLevel?: string;
  keyVerdict?: string;
  location?: string;
  googleMapsUrl?: string;
  bestTime?: string;
}

export interface NearbyGpsPlace {
  id: string;
  name: string;
  category: 'landmark' | 'restaurant' | 'cafe' | 'nature' | 'heritage' | 'shopping';
  categoryLabel: string;
  distanceMeters: number;
  distanceText: string;
  rating: number;
  reviewCount?: number;
  priceLevel?: string;
  priceLabel?: string;
  imageUrl: string;
  description: string;
  highlight: string;
  openingHours?: string;
  googleMapsUrl: string;
  addressArea: string;
  lat: number;
  lng: number;
  isAiEnhanced?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  places?: VisualPlaceCard[];
}

export interface PresetTrip {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  groupType: GroupType;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  accommodationArea: string;
  specialConstraints: string;
  dialect: DialectPreference;
  emoji: string;
  tag: string;
  imageUrl?: string;
  landmarkName?: string;
  countryName?: string;
  countryFlag?: string;
  categoryTag?: 'hajj_umrah' | 'palestine' | 'egypt' | 'gulf' | 'easy_visa' | 'nature' | 'world';
  popularFor?: string;
  highlights?: string[];
  isMultiCity?: boolean;
  cityStops?: CityStop[];
  preferredTransit?: TransitMode;
}

