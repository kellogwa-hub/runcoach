'use client';

import { useState } from 'react';

export function TredictSyncButton() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const res = await fetch('/api/tredict/sync', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyinkronkan data');
      }

      setStatusMessage(data.message || 'Sinkronisasi Tredict Berhasil!');
    } catch (err) {
      setIsError(true);
      setStatusMessage(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-sm hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Menyinkronkan...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            <span>Sinkronkan ke Tredict</span>
          </>
        )}
      </button>

      {statusMessage && (
        <span
          className={`text-xs px-2.5 py-1 rounded-md ${
            isError
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          }`}
        >
          {statusMessage}
        </span>
      )}
    </div>
  );
}
