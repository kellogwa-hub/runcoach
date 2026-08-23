'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkoutSchedule, WorkoutMetric } from '@/types';
import ScheduleBlock from './ScheduleBlock';
import { createClient } from '@/lib/supabase/client';

interface CalendarProps {
  runnerId: string;
  schedules: WorkoutSchedule[];
  onScheduleUpdated: (updatedSchedule: WorkoutSchedule) => void;
  onNewScheduleCreated: (newSchedule: WorkoutSchedule) => void;
}

export default function Calendar({
  runnerId,
  schedules: initialSchedules,
  onScheduleUpdated,
  onNewScheduleCreated,
}: CalendarProps) {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>(initialSchedules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [realtimeMetricToast, setRealtimeMetricToast] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  // Realtime subscription for incoming metric reports
  useEffect(() => {
    const channel = supabase
      .channel('coach_metrics_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workout_metrics' },
        (payload) => {
          const newMetric = payload.new as WorkoutMetric;
          setRealtimeMetricToast(`Pelari baru saja mengirimkan metrik lari! (${newMetric.distance_km} km)`);
          
          // Mark matching schedule as completed in client state
          setSchedules((prev) =>
            prev.map((s) => (s.id === newMetric.schedule_id ? { ...s, is_completed: true } : s))
          );

          setTimeout(() => setRealtimeMetricToast(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // 7 Days Grid (Current Week)
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.setDate(diffToMonday + i));
      const formatted = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      dates.push({ date: formatted, dayName, displayDate: `${d.getDate()} ${d.toLocaleDateString('id-ID', { month: 'short' })}` });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const scheduleId = String(active.id);
    const targetDate = String(over.id);

    const activeSchedule = schedules.find((s) => s.id === scheduleId);
    if (!activeSchedule || activeSchedule.scheduled_date === targetDate) return;

    // Optimistic client update
    const updated = { ...activeSchedule, scheduled_date: targetDate };
    setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? updated : s)));
    onScheduleUpdated(updated);

    try {
      await fetch('/api/schedules/reschedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_id: scheduleId, new_date: targetDate }),
      });
    } catch {
      // Revert if API fails
      setSchedules(initialSchedules);
    }
  };

  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newTitle) return;

    setLoadingAdd(true);
    try {
      const res = await fetch('/api/schedules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runner_id: runnerId,
          title: newTitle,
          description: newDesc,
          scheduled_date: selectedDate,
        }),
      });

      const data = await res.json();
      if (data.schedule) {
        onNewScheduleCreated(data.schedule);
        setSchedules((prev) => [...prev, data.schedule]);
        setNewTitle('');
        setNewDesc('');
        setShowAddForm(false);
      }
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {realtimeMetricToast && (
        <div className="rounded-xl bg-emerald-600 text-white p-3 text-sm font-semibold shadow-lg animate-bounce flex items-center justify-between">
          <span>🔔 {realtimeMetricToast}</span>
          <button onClick={() => setRealtimeMetricToast(null)} className="text-white text-xs opacity-75 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Calendar Header & Add Form */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Jadwal Minggu Ini</h2>
          <p className="text-xs text-slate-500">Tarik & lepas (drag-and-drop) modul latihan untuk merubah tanggal</p>
        </div>

        <button
          onClick={() => {
            setSelectedDate(weekDates[0].date);
            setShowAddForm(!showAddForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          + Buat Jadwal Baru
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddScheduleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tambah Latihan Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">Tanggal</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2"
              >
                {weekDates.map((w) => (
                  <option key={w.date} value={w.date}>
                    {w.dayName}, {w.displayDate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">Judul Latihan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Easy Run 5K"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">Target / Catatan</label>
              <input
                type="text"
                placeholder="Contoh: Pace 6:00, HR Zone 2"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loadingAdd}
              className="px-3 py-1.5 text-xs rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              {loadingAdd ? 'Simpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      )}

      {/* Calendar Grid DnD Container */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {weekDates.map((day) => {
            const daySchedules = schedules.filter((s) => s.scheduled_date === day.date);

            return (
              <div
                key={day.date}
                id={day.date}
                className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col min-h-[180px] shadow-sm"
              >
                <div className="border-b border-slate-100 pb-2 mb-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">{day.dayName}</div>
                  <div className="text-sm font-extrabold text-slate-900">{day.displayDate}</div>
                </div>

                <SortableContext items={daySchedules.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 space-y-2">
                    {daySchedules.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-300 italic border-2 border-dashed border-slate-100 rounded-lg p-2">
                        Kosong
                      </div>
                    ) : (
                      daySchedules.map((sched) => (
                        <ScheduleBlock key={sched.id} schedule={sched} />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
