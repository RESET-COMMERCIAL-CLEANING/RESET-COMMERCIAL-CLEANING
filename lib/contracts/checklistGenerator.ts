// Dynamic checklist generation based on property type and cleaning type

export interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  requiresPhotos: boolean;
  requiresSignOff: boolean;
  estimatedTimeMinutes?: number;
  safetyWarnings?: string[];
  notes?: string;
}

export interface GeneratedChecklist {
  id: string;
  jobId: string;
  contractId: string;
  propertyType: string;
  cleaningType: string;
  items: ChecklistItem[];
  totalEstimatedTime: number; // in minutes
  createdAt: Date;
}

type PropertyType = 'office' | 'retail' | 'warehouse' | 'medical' | 'restaurant' | 'school' | 'other';
type CleaningType = 'standard' | 'deep-clean' | 'post-construction' | 'specialized-medical';

/**
 * Standard cleaning checklist items
 */
const STANDARD_CLEAN_ITEMS: Record<PropertyType, ChecklistItem[]> = {
  office: [
    {
      id: 'office-std-1',
      task: 'Vacuum all carpeted areas including under furniture',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      notes: 'Include all corners and edges',
    },
    {
      id: 'office-std-2',
      task: 'Mop hard floors and entryways',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
      safetyWarnings: ['Wet floor - place signs'],
    },
    {
      id: 'office-std-3',
      task: 'Dust all surfaces, desks, and shelving',
      category: 'Surfaces',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 25,
      notes: 'Use microfiber cloths, avoid electronics',
    },
    {
      id: 'office-std-4',
      task: 'Clean and disinfect high-touch areas (doors, handles, switches)',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
      notes: 'Light switches, door handles, handrails',
    },
    {
      id: 'office-std-5',
      task: 'Empty trash and replace liners',
      category: 'General',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 10,
    },
    {
      id: 'office-std-6',
      task: 'Clean windows and glass partitions',
      category: 'Windows',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Use proper ladder techniques', 'Check for sharp edges'],
    },
    {
      id: 'office-std-7',
      task: 'Clean bathrooms - toilets, sinks, mirrors',
      category: 'Bathrooms',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Use appropriate PPE - gloves, mask'],
    },
    {
      id: 'office-std-8',
      task: 'Restock bathrooms (soap, paper towels, toilet paper)',
      category: 'Bathrooms',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 5,
    },
    {
      id: 'office-std-9',
      task: 'Final walkthrough and quality check',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
      notes: 'Client sign-off required',
    },
  ],
  retail: [
    {
      id: 'retail-std-1',
      task: 'Sweep and vacuum sales floor',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 25,
      notes: 'Move displays carefully, watch for merchandise',
    },
    {
      id: 'retail-std-2',
      task: 'Mop floors and clean entrance',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Wet floor signs required'],
    },
    {
      id: 'retail-std-3',
      task: 'Clean display cases and glass surfaces',
      category: 'Surfaces',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      notes: 'Use glass cleaner, avoid product damage',
    },
    {
      id: 'retail-std-4',
      task: 'Disinfect checkout counter and point-of-sale',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 10,
    },
    {
      id: 'retail-std-5',
      task: 'Clean mirrors and windows',
      category: 'Windows',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
    },
    {
      id: 'retail-std-6',
      task: 'Empty trash and replace bags',
      category: 'General',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 10,
    },
    {
      id: 'retail-std-7',
      task: 'Clean bathrooms (if applicable)',
      category: 'Bathrooms',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 15,
      safetyWarnings: ['Use appropriate PPE'],
    },
    {
      id: 'retail-std-8',
      task: 'Final walkthrough - check for missed areas',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
    },
  ],
  warehouse: [
    {
      id: 'warehouse-std-1',
      task: 'Sweep and clear floors of debris',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 40,
      notes: 'Watch for machinery and inventory',
    },
    {
      id: 'warehouse-std-2',
      task: 'Mop floors and remove spills',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 30,
      safetyWarnings: ['Wet floor signs', 'Watch for forklifts'],
    },
    {
      id: 'warehouse-std-3',
      task: 'Clean and wipe down racking and storage',
      category: 'Surfaces',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 30,
      safetyWarnings: ['Safety gear required', 'Check load stability'],
    },
    {
      id: 'warehouse-std-4',
      task: 'Disinfect high-touch areas',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
    },
    {
      id: 'warehouse-std-5',
      task: 'Empty waste bins and dispose properly',
      category: 'General',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
      safetyWarnings: ['Follow hazmat protocols if needed'],
    },
    {
      id: 'warehouse-std-6',
      task: 'Final inspection and safety check',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
    },
  ],
  medical: [
    {
      id: 'medical-std-1',
      task: 'Disinfect all surfaces with medical-grade sanitizer',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 30,
      safetyWarnings: ['Use approved medical-grade products', 'Wear appropriate PPE'],
      notes: 'Document all areas treated',
    },
    {
      id: 'medical-std-2',
      task: 'Clean patient treatment areas',
      category: 'Medical Areas',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 25,
      safetyWarnings: ['Follow infection control procedures', 'Biohazard protocols'],
    },
    {
      id: 'medical-std-3',
      task: 'Clean and sanitize waiting room',
      category: 'Common Areas',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      notes: 'Pay special attention to seating',
    },
    {
      id: 'medical-std-4',
      task: 'Mop and disinfect flooring',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Wet floor signs'],
    },
    {
      id: 'medical-std-5',
      task: 'Clean and restock restrooms',
      category: 'Bathrooms',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Use medical-grade cleaners', 'Proper disposal of waste'],
    },
    {
      id: 'medical-std-6',
      task: 'Final compliance verification',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
      notes: 'Provider and supervisor sign-off required',
    },
  ],
  restaurant: [
    {
      id: 'restaurant-std-1',
      task: 'Clean and sanitize kitchen surfaces',
      category: 'Kitchen',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 30,
      safetyWarnings: ['Sharp edges', 'Hot surfaces', 'Grease hazards'],
      notes: 'Include counters, appliances, and backsplash',
    },
    {
      id: 'restaurant-std-2',
      task: 'Deep clean floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 25,
      safetyWarnings: ['Slipping hazard', 'Wet floor signs'],
    },
    {
      id: 'restaurant-std-3',
      task: 'Clean dining area and tables',
      category: 'Dining',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
    },
    {
      id: 'restaurant-std-4',
      task: 'Disinfect high-touch areas',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
      notes: 'Door handles, light switches, payment terminals',
    },
    {
      id: 'restaurant-std-5',
      task: 'Clean restrooms and restock supplies',
      category: 'Bathrooms',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 15,
      safetyWarnings: ['Appropriate PPE required'],
    },
    {
      id: 'restaurant-std-6',
      task: 'Final walkthrough and health compliance check',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
      notes: 'Manager sign-off required',
    },
  ],
  school: [
    {
      id: 'school-std-1',
      task: 'Clean and vacuum classrooms',
      category: 'Classrooms',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 30,
      notes: 'Move chairs and desks carefully',
    },
    {
      id: 'school-std-2',
      task: 'Clean hallways and common areas',
      category: 'Common Areas',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 25,
      safetyWarnings: ['Watch for wet floors', 'Heavy foot traffic areas'],
    },
    {
      id: 'school-std-3',
      task: 'Disinfect high-touch surfaces',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
      notes: 'Doorknobs, handrails, light switches',
    },
    {
      id: 'school-std-4',
      task: 'Clean and restock bathrooms',
      category: 'Bathrooms',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 20,
      safetyWarnings: ['Child safety considerations'],
    },
    {
      id: 'school-std-5',
      task: 'Empty trash and replace liners',
      category: 'General',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
    },
    {
      id: 'school-std-6',
      task: 'Final quality check',
      category: 'Quality Assurance',
      requiresPhotos: false,
      requiresSignOff: true,
      estimatedTimeMinutes: 10,
      notes: 'Facilities manager sign-off',
    },
  ],
  other: [
    {
      id: 'other-std-1',
      task: 'Vacuum and sweep all areas',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
    },
    {
      id: 'other-std-2',
      task: 'Mop floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 15,
    },
    {
      id: 'other-std-3',
      task: 'Dust and clean surfaces',
      category: 'Surfaces',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 20,
    },
    {
      id: 'other-std-4',
      task: 'Disinfect high-touch areas',
      category: 'Sanitization',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 10,
    },
    {
      id: 'other-std-5',
      task: 'Empty trash and replace liners',
      category: 'General',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 10,
    },
  ],
};

/**
 * Deep clean adds additional items
 */
const DEEP_CLEAN_ADDITIONS: Record<PropertyType, ChecklistItem[]> = {
  office: [
    {
      id: 'office-deep-1',
      task: 'Shampoo and deep clean carpets',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 60,
      safetyWarnings: ['Ensure proper drying time before use'],
    },
    {
      id: 'office-deep-2',
      task: 'Polish hard floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 40,
      safetyWarnings: ['Slipping hazard during drying'],
    },
    {
      id: 'office-deep-3',
      task: 'Clean inside cabinets and drawers',
      category: 'Surfaces',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 30,
    },
    {
      id: 'office-deep-4',
      task: 'Deep clean windows inside and out',
      category: 'Windows',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 45,
    },
    {
      id: 'office-deep-5',
      task: 'Steam clean upholstered furniture',
      category: 'Furniture',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 40,
    },
  ],
  retail: [
    {
      id: 'retail-deep-1',
      task: 'Deep clean and strip/wax floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 90,
      safetyWarnings: ['Extended drying time required'],
    },
    {
      id: 'retail-deep-2',
      task: 'Clean and polish all glass surfaces',
      category: 'Windows',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 40,
    },
    {
      id: 'retail-deep-3',
      task: 'Deep clean interior store fixtures',
      category: 'Fixtures',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 45,
    },
  ],
  warehouse: [
    {
      id: 'warehouse-deep-1',
      task: 'Power wash hard floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 90,
      safetyWarnings: ['Electrical hazard', 'Noise level', 'Drainage planning'],
    },
    {
      id: 'warehouse-deep-2',
      task: 'Deep clean racking and shelving',
      category: 'Surfaces',
      requiresPhotos: false,
      requiresSignOff: false,
      estimatedTimeMinutes: 60,
    },
  ],
  medical: [
    {
      id: 'medical-deep-1',
      task: 'Deep disinfection of all equipment',
      category: 'Medical Equipment',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 50,
      safetyWarnings: ['Medical-grade products only', 'Biohazard protocols'],
    },
    {
      id: 'medical-deep-2',
      task: 'Steam clean soft furnishings',
      category: 'Furniture',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 40,
    },
  ],
  restaurant: [
    {
      id: 'restaurant-deep-1',
      task: 'Professional kitchen hood and filter cleaning',
      category: 'Kitchen',
      requiresPhotos: true,
      requiresSignOff: true,
      estimatedTimeMinutes: 90,
      safetyWarnings: ['Fire hazard', 'Specialized equipment'],
    },
    {
      id: 'restaurant-deep-2',
      task: 'Degrease all kitchen surfaces',
      category: 'Kitchen',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 60,
    },
  ],
  school: [
    {
      id: 'school-deep-1',
      task: 'Deep clean all classroom furniture',
      category: 'Classrooms',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 50,
    },
    {
      id: 'school-deep-2',
      task: 'Strip and rewax hallway floors',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 75,
    },
  ],
  other: [
    {
      id: 'other-deep-1',
      task: 'Deep clean carpets and upholstery',
      category: 'Flooring',
      requiresPhotos: true,
      requiresSignOff: false,
      estimatedTimeMinutes: 50,
    },
  ],
};

/**
 * Generate a checklist based on property and cleaning type
 */
export function generateChecklist(
  jobId: string,
  contractId: string,
  propertyType: PropertyType,
  cleaningType: CleaningType
): GeneratedChecklist {
  let items: ChecklistItem[] = [...(STANDARD_CLEAN_ITEMS[propertyType] || STANDARD_CLEAN_ITEMS.other)];

  // Add deep clean items if applicable
  if (cleaningType === 'deep-clean') {
    const deepItems = DEEP_CLEAN_ADDITIONS[propertyType] || [];
    items = [...items, ...deepItems];
  }

  // For specialized medical, ensure all items require sign-off
  if (cleaningType === 'specialized-medical') {
    items = items.map((item) => ({
      ...item,
      requiresSignOff: true,
    }));
  }

  const totalTime = items.reduce((sum, item) => sum + (item.estimatedTimeMinutes || 0), 0);

  return {
    id: `checklist-${jobId}-${Date.now()}`,
    jobId,
    contractId,
    propertyType,
    cleaningType,
    items,
    totalEstimatedTime: totalTime,
    createdAt: new Date(),
  };
}

/**
 * Get category summary for a checklist
 */
export function getCategoryBreakdown(checklist: GeneratedChecklist) {
  const breakdown: Record<string, { count: number; time: number }> = {};

  checklist.items.forEach((item) => {
    if (!breakdown[item.category]) {
      breakdown[item.category] = { count: 0, time: 0 };
    }
    breakdown[item.category].count++;
    breakdown[item.category].time += item.estimatedTimeMinutes || 0;
  });

  return breakdown;
}
