# Contract: VDOT & FTHR Calculator API Endpoint

## Overview

Endpoint `POST /api/zones/calculate` mengkalkulasi rentang laju (pace) dan detak jantung (heart rate) berdasarkan input VDOT dan/atau FTHR.

---

## Endpoint Details

- **URL**: `/api/zones/calculate`
- **Method**: `POST`
- **Authentication**: Required (Supabase Auth Session)
- **Content-Type**: `application/json`

---

## Request Format

```json
{
  "vdot": 45.0,        // Optional, float (15.0 - 85.0)
  "fthr": 165,         // Optional, integer (100 - 220 bpm)
  "runnerId": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

## Response Format (HTTP 200 OK)

```json
{
  "success": true,
  "vdot": 45.0,
  "fthr": 165,
  "paceZones": {
    "E": { "name": "Easy", "minPace": "05:45", "maxPace": "06:25", "unit": "min/km" },
    "M": { "name": "Marathon", "minPace": "05:10", "maxPace": "05:35", "unit": "min/km" },
    "T": { "name": "Threshold", "minPace": "04:45", "maxPace": "05:00", "unit": "min/km" },
    "I": { "name": "Interval", "minPace": "04:15", "maxPace": "04:30", "unit": "min/km" },
    "R": { "name": "Repetition", "minPace": "03:55", "maxPace": "04:10", "unit": "min/km" }
  },
  "hrZones": {
    "Z1": { "name": "Active Recovery", "minHr": 115, "maxHr": 133, "unit": "bpm" },
    "Z2": { "name": "Aerobic / Endurance", "minHr": 134, "maxHr": 147, "unit": "bpm" },
    "Z3": { "name": "Tempo / Aerobic Power", "minHr": 148, "maxHr": 156, "unit": "bpm" },
    "Z4": { "name": "Sub-Threshold", "minHr": 157, "maxHr": 164, "unit": "bpm" },
    "Z5": { "name": "Super-Threshold / VO2Max", "minHr": 165, "maxHr": 178, "unit": "bpm" }
  }
}
```
