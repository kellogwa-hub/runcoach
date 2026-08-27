import { PaceZoneDetail, HrZoneDetail, PaceZoneName } from '@/types';

/**
 * Format seconds per kilometer into MM:SS format
 */
function secondsToPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate Pace Zones based on VDOT score (Daniels' Running Formula approximation)
 */
export function calculatePaceZones(vdot: number): Record<PaceZoneName, PaceZoneDetail> {
  // Base pace in sec/km for VDOT 45 (approx 285s / 4:45 per km Threshold)
  // Scaling factor: higher VDOT = faster pace (fewer sec/km)
  const baseT = 285 * Math.pow(45 / vdot, 0.85);

  return {
    E: {
      name: 'Easy / Recovery',
      minPace: secondsToPace(baseT * 1.18),
      maxPace: secondsToPace(baseT * 1.35),
      unit: 'min/km',
    },
    M: {
      name: 'Marathon Pace',
      minPace: secondsToPace(baseT * 1.07),
      maxPace: secondsToPace(baseT * 1.16),
      unit: 'min/km',
    },
    T: {
      name: 'Threshold / Tempo',
      minPace: secondsToPace(baseT * 0.98),
      maxPace: secondsToPace(baseT * 1.05),
      unit: 'min/km',
    },
    I: {
      name: 'Interval / VO2Max',
      minPace: secondsToPace(baseT * 0.88),
      maxPace: secondsToPace(baseT * 0.94),
      unit: 'min/km',
    },
    R: {
      name: 'Repetition / Speed',
      minPace: secondsToPace(baseT * 0.80),
      maxPace: secondsToPace(baseT * 0.86),
      unit: 'min/km',
    },
  };
}

/**
 * Calculate Heart Rate Zones based on FTHR (Joe Friel Model)
 */
export function calculateHrZones(fthr: number): Record<string, HrZoneDetail> {
  return {
    Z1: {
      name: 'Active Recovery',
      minHr: Math.round(fthr * 0.68),
      maxHr: Math.round(fthr * 0.80),
      unit: 'bpm',
    },
    Z2: {
      name: 'Aerobic / Endurance',
      minHr: Math.round(fthr * 0.81),
      maxHr: Math.round(fthr * 0.89),
      unit: 'bpm',
    },
    Z3: {
      name: 'Tempo / Aerobic Power',
      minHr: Math.round(fthr * 0.90),
      maxHr: Math.round(fthr * 0.94),
      unit: 'bpm',
    },
    Z4: {
      name: 'Sub-Threshold',
      minHr: Math.round(fthr * 0.95),
      maxHr: Math.round(fthr * 0.99),
      unit: 'bpm',
    },
    Z5: {
      name: 'Super-Threshold / VO2Max',
      minHr: Math.round(fthr * 1.00),
      maxHr: Math.round(fthr * 1.08),
      unit: 'bpm',
    },
  };
}
