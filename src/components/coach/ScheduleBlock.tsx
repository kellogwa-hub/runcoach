'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkoutSchedule } from '@/types';

interface ScheduleBlockProps {
  schedule: WorkoutSchedule;
}

export default function ScheduleBlock({ schedule }: ScheduleBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: schedule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing rounded-lg p-2 text-xs font-semibold shadow-sm transition border ${
        schedule.is_completed
          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
          : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{schedule.title}</span>
        {schedule.is_completed && (
          <span className="ml-1 text-[10px] bg-emerald-700 text-white px-1 rounded">✓ Selesai</span>
        )}
      </div>
      {schedule.description && (
        <div className="text-[10px] opacity-90 truncate mt-0.5">{schedule.description}</div>
      )}
    </div>
  );
}
