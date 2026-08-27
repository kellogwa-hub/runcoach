# Contract: Tredict Sync API Endpoint

## Overview

Endpoint `POST /api/tredict/sync` memicu penarikan data metrik latihan aktual (durasi, detak jantung, pace) dari Tredict REST API ke database platform Supabase.

---

## Endpoint Details

- **URL**: `/api/tredict/sync`
- **Method**: `POST`
- **Authentication**: Required (Supabase Auth Cookie / Bearer Session)
- **Content-Type**: `application/json`

---

## Request Format

```json
{
  "runnerId": "123e4567-e89b-12d3-a456-426614174000", // Optional, default: current authenticated user
  "forceRefresh": false
}
```

---

## Response Formats

### Success Response (HTTP 200 OK)

```json
{
  "success": true,
  "syncedCount": 5,
  "tredictTotal": 12,
  "lastSyncedAt": "2026-08-27T17:00:00.000Z",
  "message": "Berhasil menyinkronkan 5 metrik latihan terbaru dari Tredict!"
}
```

### Unauthorized Error (HTTP 401 Unauthorized)

```json
{
  "error": "Unauthorized: Silakan login terlebih dahulu."
}
```

### Tredict Authentication Error (HTTP 400 Bad Request)

```json
{
  "error": "Kredensial API Key Tredict tidak valid atau belum dikonfigurasi."
}
```

### Server Error (HTTP 500 Internal Server Error)

```json
{
  "error": "Gagal terhubung ke Tredict API. Menggunakan data lokal terakhir."
}
```
