// Subcontractor management and queries

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

export interface Subcontractor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  suburb: string;
  serviceAreaKm: number;
  baseHourlyRate: number;
  specializations: string[];
  status: 'active' | 'inactive' | 'on-hold';
  abn: string;
  hasPublicLiability: boolean;
  hasPoliceCheck: boolean;
  ecoFriendlyCapable: boolean;
  weeklyAvailableHours: number;
  averageRating?: number;
  totalJobsCompleted?: number;
  lastAssignmentDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const subcontractorsCollection = collection(db, 'subcontractors');

/**
 * Get subcontractor by ID
 */
export const getSubcontractor = async (subcontractorId: string): Promise<Subcontractor | null> => {
  const docRef = doc(subcontractorsCollection, subcontractorId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Subcontractor) : null;
};

/**
 * Get all active subcontractors
 */
export const getAllActiveSubcontractors = async (): Promise<Subcontractor[]> => {
  const q = query(subcontractorsCollection, where('status', '==', 'active'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Subcontractor,
    id: doc.id,
  }));
};

/**
 * Get subcontractors by service area
 * Filters by suburb/location
 */
export const getSubcontractorsByServiceArea = async (suburb: string, radiusKm: number = 50): Promise<Subcontractor[]> => {
  const q = query(subcontractorsCollection, where('status', '==', 'active'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs
    .map(doc => ({
      ...doc.data() as Subcontractor,
      id: doc.id,
    }))
    .filter(sub => {
      // Simple filter - in production, use geohashing or geographic queries
      return sub.suburb?.toLowerCase().includes(suburb.toLowerCase()) ||
             (sub.serviceAreaKm >= radiusKm);
    });
};

/**
 * Get subcontractors by specialization
 */
export const getSubcontractorsBySpecialization = async (specialization: string): Promise<Subcontractor[]> => {
  const allSubs = await getAllActiveSubcontractors();
  return allSubs.filter(sub =>
    sub.specializations?.some(s => s.toLowerCase().includes(specialization.toLowerCase()))
  );
};

/**
 * Get subcontractors with availability
 */
export const getAvailableSubcontractors = async (minimumHours: number = 5): Promise<Subcontractor[]> => {
  const allSubs = await getAllActiveSubcontractors();
  return allSubs.filter(sub => sub.weeklyAvailableHours >= minimumHours);
};

/**
 * Get top-rated subcontractors
 */
export const getTopRatedSubcontractors = async (minRating: number = 4.5, limit: number = 10): Promise<Subcontractor[]> => {
  const allSubs = await getAllActiveSubcontractors();
  return allSubs
    .filter(sub => (sub.averageRating || 0) >= minRating)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);
};

/**
 * Get recommended subcontractors for a contract
 * Filters by service area, availability, and specializations
 */
export const getRecommendedSubcontractors = async (params: {
  suburb?: string;
  specializations?: string[];
  minimumAvailability?: number;
  radiusKm?: number;
}): Promise<Subcontractor[]> => {
  const { suburb, specializations = [], minimumAvailability = 5, radiusKm = 50 } = params;

  let results = await getAllActiveSubcontractors();

  // Filter by location
  if (suburb) {
    results = results.filter(sub =>
      sub.suburb?.toLowerCase().includes(suburb.toLowerCase()) ||
      sub.serviceAreaKm >= radiusKm
    );
  }

  // Filter by availability
  results = results.filter(sub => sub.weeklyAvailableHours >= minimumAvailability);

  // Filter by specialization (if provided)
  if (specializations.length > 0) {
    results = results.filter(sub =>
      specializations.some(spec =>
        sub.specializations?.some(s => s.toLowerCase().includes(spec.toLowerCase()))
      )
    );
  }

  // Sort by rating (highest first)
  results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

  return results;
};

/**
 * Subscribe to real-time subcontractor updates
 */
export const subscribeToActiveSubcontractors = (callback: (subcontractors: Subcontractor[]) => void) => {
  const q = query(subcontractorsCollection, where('status', '==', 'active'));
  return onSnapshot(q, (querySnapshot) => {
    const subcontractors = querySnapshot.docs.map(doc => ({
      ...doc.data() as Subcontractor,
      id: doc.id,
    }));
    callback(subcontractors);
  });
};

/**
 * Get subcontractor with full details for contract assignment
 */
export const getSubcontractorForAssignment = async (subcontractorId: string): Promise<{ id: string; name: string; email: string; phone: string; hourlyRate: number } | null> => {
  const sub = await getSubcontractor(subcontractorId);
  if (!sub) return null;

  return {
    id: subcontractorId,
    name: `${sub.firstName} ${sub.lastName}`,
    email: sub.email,
    phone: sub.phone,
    hourlyRate: sub.baseHourlyRate,
  };
};

/**
 * Get subcontractor list formatted for UI dropdowns
 */
export const getSubcontractorSelectOptions = async (): Promise<Array<{ id: string; name: string; rating?: number; availability?: number }>> => {
  const subs = await getAllActiveSubcontractors();
  return subs.map(sub => ({
    id: sub.id,
    name: `${sub.firstName} ${sub.lastName} - $${sub.baseHourlyRate}/hr`,
    rating: sub.averageRating,
    availability: sub.weeklyAvailableHours,
  }));
};

/**
 * Get subcontractors by multiple criteria for smart assignment
 */
export const getOptimalSubcontractors = async (params: {
  suburb?: string;
  propertyType?: string;
  cleaningType?: string;
  preferredHourlyRate?: number;
  minimumRating?: number;
}): Promise<Subcontractor[]> => {
  const {
    suburb,
    propertyType,
    minimumRating = 4.0,
  } = params;

  let results = await getAllActiveSubcontractors();

  // Filter by location
  if (suburb) {
    results = results.filter(sub =>
      sub.suburb?.toLowerCase().includes(suburb.toLowerCase())
    );
  }

  // Filter by rating
  results = results.filter(sub => (sub.averageRating || 0) >= minimumRating);

  // Filter by availability (at least 5 hours)
  results = results.filter(sub => sub.weeklyAvailableHours >= 5);

  // Sort by rating and availability
  results.sort((a, b) => {
    const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    return b.weeklyAvailableHours - a.weeklyAvailableHours;
  });

  return results.slice(0, 5); // Return top 5 matches
};

/**
 * Get simple list for contract management UI
 */
export const getSubcontractorsForContractAssignment = async (): Promise<Array<{ id: string; name: string }>> => {
  const subs = await getAllActiveSubcontractors();
  return subs.map(sub => ({
    id: sub.id,
    name: `${sub.firstName} ${sub.lastName}`,
  }));
};
