export type ServiceDetailSections = {
  overview?: string;
  whatsIncluded?: string[];
  howItWorks?: string[];
  pricing?: { model: string; notes: string[] };
  addOns?: string[];
  customerPreparation?: string[];
  safetyAndTrust?: string[];
  safetyAndCompliance?: string[];
  idealFor?: string[];
  serviceOptions?: string[];
  availableServices?: string[];
  whyBundle?: string[];
  subscriptionOptions?: string[];
};

export type ServiceDetail = {
  type: string;
  title: string;
  shortDescription: string;
  sections: ServiceDetailSections;
  cta: {
    primary: { label: string; action: string; serviceType: string };
    secondary: { label: string; action: string; serviceType: string };
  };
  meta: {
    tags: string[];
    recommendedFor: string[];
  };
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    type: "DRIVEWAY_CAR_WASH",
    title: "Driveway Mobile Car Washing",
    shortDescription:
      "Professional vehicle cleaning delivered to your driveway—no lines, no driving.",
    sections: {
      overview:
        "Sulber's Driveway Car Wash brings professional vehicle cleaning directly to your home. No need to drive to a car wash or wait in line—our verified providers come to your driveway fully equipped.",
      whatsIncluded: [
        "Exterior hand wash",
        "Wheel and tire cleaning",
        "Exterior window cleaning",
        "Drying with microfiber towels",
        "Tire shine finish",
        "And more...",
      ],
      howItWorks: [
        "Enter your service location.",
        "Select your vehicle type.",
        "Choose a date and time.",
        "Get matched with a nearby verified provider.",
        "Track arrival in real time.",
        "Review before/after photos when completed.",
      ],
      pricing: {
        model: "vehicle_type_based",
        notes: [
          "Base price varies by vehicle type.",
          "Larger vehicles may cost slightly more.",
          "Add-ons available for deeper cleaning and base on service provider pricing.",
        ],
      },
      addOns: [
        "Interior deep cleaning",
        "Wax & polish",
        "Engine bay cleaning",
        "Odor removal",
        "Multiple vehicles discount",
      ],
      customerPreparation: [
        "Provide access to driveway space.",
        "Ensure the vehicle is unlocked if interior service is selected.",
        "Remove valuables from the car before service.",
      ],
      safetyAndTrust: [
        "Providers are ID-verified.",
        "Insurance coverage required for property damage.",
        "Secure payments through the Sulber platform.",
      ],
    },
    cta: {
      primary: { label: "Book Car Wash", action: "BOOK", serviceType: "DRIVEWAY_CAR_WASH" },
      secondary: { label: "View Pricing", action: "VIEW_PRICING", serviceType: "DRIVEWAY_CAR_WASH" },
    },
    meta: {
      tags: ["on-demand", "driveway", "car-care"],
      recommendedFor: ["Busy professionals", "Families", "Anyone who wants convenience"],
    },
  },
  {
    type: "PARKING_LOT_CLEANING",
    title: "Parking Lot Car Cleaning",
    shortDescription:
      "On-site vehicle cleaning for residential or commercial parking lots—clean without moving your car.",
    sections: {
      overview:
        "Perfect for residential complexes, office parking lots, or commercial spaces. Sulber provides on-site vehicle cleaning services without customers leaving their parking spot.",
      whatsIncluded: [
        "Exterior wash",
        "Wheel and tire cleaning",
        "Window cleaning",
        "Quick surface wipe-down",
      ],
      idealFor: [
        "Apartment buildings",
        "Office complexes",
        "Corporate fleets",
        "Event parking areas",
      ],
      howItWorks: [
        "Select the parking lot location.",
        "Choose vehicle type and number of vehicles.",
        "Book for individual or multiple cars.",
        "Provider arrives with portable equipment.",
        "Vehicles are cleaned on-site.",
      ],
      pricing: {
        model: "per_vehicle_and_fleet",
        notes: [
          "Per vehicle pricing.",
          "Bulk discounts for 3+ vehicles.",
          "Based on service provider pricing.",
        ],
      },
      addOns: ["Fleet contract packages", "Monthly maintenance plans", "Interior detailing"],
      customerPreparation: [
        "Ensure the provider can access the vehicle.",
        "If interior cleaning is selected, keep the car unlocked or provide instructions.",
        "Remove valuables before service.",
      ],
      safetyAndCompliance: [
        "Eco-friendly cleaning products where possible.",
        "Responsible wastewater handling guidelines.",
        "Fully insured providers.",
      ],
    },
    cta: {
      primary: {
        label: "Book Parking Lot Cleaning",
        action: "BOOK",
        serviceType: "PARKING_LOT_CLEANING",
      },
      secondary: {
        label: "Request Fleet Quote",
        action: "REQUEST_QUOTE",
        serviceType: "PARKING_LOT_CLEANING",
      },
    },
    meta: {
      tags: ["commercial", "fleet", "on-site"],
      recommendedFor: ["Apartment residents", "Office workers", "Fleet managers"],
    },
  },
  {
    type: "HOUSE_WINDOW_CLEANING",
    title: "Residential Window Cleaning",
    shortDescription:
      "Crystal-clear windows with a streak-free finish—exterior and interior options available.",
    sections: {
      overview:
        "Keep your home looking bright and crystal clear with Sulber's professional window cleaning service. Exterior and interior options are available depending on your needs.",
      whatsIncluded: [
        "Exterior glass cleaning",
        "Frame wipe-down",
        "Sill cleaning",
        "Streak-free finish",
      ],
      serviceOptions: [
        "Exterior-only window cleaning",
        "Interior + exterior window cleaning",
        "Ground-level windows",
        "Multi-story homes",
      ],
      howItWorks: [
        "Enter your home address.",
        "Select the number of windows (or estimate).",
        "Choose interior/exterior option.",
        "Schedule a date and time.",
        "Provider completes the service safely.",
      ],
      pricing: {
        model: "per_window_or_per_floor",
        notes: [
          "Per-window pricing for simple homes.",
          "Per-floor pricing for multi-story homes.",
          "Bundle discounts available.",
          "Based on service provider pricing.",
        ],
      },
      addOns: [
        "Screen cleaning",
        "Track cleaning",
        "Hard water stain treatment",
        "Seasonal package (spring/fall)",
      ],
      customerPreparation: [
        "Clear access to windows (move small items if needed).",
        "Remove fragile decor near windows.",
        "Let the provider know about pets or special access instructions.",
      ],
      safetyAndTrust: [
        "Ladder safety protocols followed for elevated work.",
        "Insurance required for multi-story services.",
        "Verified providers only.",
      ],
    },
    cta: {
      primary: {
        label: "Book Window Cleaning",
        action: "BOOK",
        serviceType: "HOUSE_WINDOW_CLEANING",
      },
      secondary: {
        label: "Estimate Windows",
        action: "ESTIMATE",
        serviceType: "HOUSE_WINDOW_CLEANING",
      },
    },
    meta: {
      tags: ["home", "windows", "exterior"],
      recommendedFor: ["Homeowners", "Spring cleaning", "Pre-sale home refresh"],
    },
  },
  {
    type: "SNOW_SHOVELING",
    title: "Driveway Snow & Ice Removal",
    shortDescription:
      "Fast, reliable snow clearing for driveways and walkways—stay safe all winter.",
    sections: {
      overview:
        "Stay safe during winter with Sulber's snow shoveling service. We clear driveways and walkways quickly after snowfall, helping you maintain safe access to your home.",
      whatsIncluded: [
        "Driveway snow removal",
        "Walkway clearing",
        "Front entrance clearing",
      ],
      idealFor: [
        "Busy professionals",
        "Elderly homeowners",
        "Families",
        "Rental properties",
      ],
      howItWorks: [
        "Request service during or after snowfall.",
        "Choose one-time or recurring service.",
        "Get matched with a nearby provider based on availability.",
        "Track job status updates.",
        "Receive a completion photo when finished.",
      ],
      pricing: {
        model: "area_and_conditions",
        notes: [
          "Based on driveway size (sq ft) and snow depth.",
          "Surge pricing may apply during major storms.",
          "Monthly winter packages available.",
          "Based on service provider pricing.",
        ],
      },
      addOns: [
        "Ice melt / de-icing treatment",
        "Emergency same-day service",
        "Extra walkway areas (side/back entrances)",
      ],
      customerPreparation: [
        "Mark any hidden obstacles (steps, hoses, decorations).",
        "Let the provider know where to pile snow if you have a preference.",
        "Keep pets indoors during service if possible.",
      ],
      safetyAndTrust: [
        "Professional-grade equipment may be used.",
        "Slip hazard reduction focus.",
        "Providers verified and insured.",
      ],
    },
    cta: {
      primary: { label: "Book Snow Removal", action: "BOOK", serviceType: "SNOW_SHOVELING" },
      secondary: { label: "Winter Plans", action: "VIEW_PLANS", serviceType: "SNOW_SHOVELING" },
    },
    meta: {
      tags: ["winter", "safety", "driveway"],
      recommendedFor: [
        "Winter storms",
        "Recurring weekly clearing",
        "Emergency clearing",
      ],
    },
  },
  {
    type: "HOME_SERVICES",
    title: "Home Services Bundle",
    shortDescription:
      "Bundle exterior home services and save time—book multiple services in one visit.",
    sections: {
      overview:
        "Sulber offers a range of driveway-delivered exterior services to keep your home and vehicles clean, safe, and well-maintained. Bundle multiple services and save time.",
      availableServices: [
        "Driveway Car Wash",
        "Parking Lot Car Cleaning",
        "Residential Window Cleaning",
        "Snow Shoveling",
      ],
      whyBundle: [
        "Save time with fewer appointments",
        "Bundle discounts and seasonal deals",
        "One platform for all exterior services",
        "Cleaner and safer property year-round",
      ],
      subscriptionOptions: [
        "Monthly maintenance plans",
        "Seasonal bundles (Spring Refresh / Winter Ready)",
        "Custom recurring schedules",
      ],
    },
    cta: {
      primary: { label: "Build a Bundle", action: "BUILD_BUNDLE", serviceType: "HOME_SERVICES" },
      secondary: { label: "Explore Services", action: "EXPLORE", serviceType: "HOME_SERVICES" },
    },
    meta: {
      tags: ["bundle", "subscription", "savings"],
      recommendedFor: ["Homeowners", "Busy families", "Recurring maintenance"],
    },
  },
];

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  whatsIncluded: "What's Included",
  howItWorks: "How It Works",
  pricing: "Pricing",
  addOns: "Add-ons",
  customerPreparation: "Customer Preparation",
  safetyAndTrust: "Safety & Trust",
  safetyAndCompliance: "Safety & Compliance",
  idealFor: "Ideal For",
  serviceOptions: "Service Options",
  availableServices: "Available Services",
  whyBundle: "Why Bundle",
  subscriptionOptions: "Subscription Options",
};

export function getSectionLabel(key: string): string {
  return SECTION_LABELS[key] ?? key;
}

export function getServiceDetailByType(type: string): ServiceDetail | undefined {
  return SERVICE_DETAILS.find((s) => s.type === type);
}
