import { FaCheck, FaMinus } from 'react-icons/fa6';

export type MiniCalendarDay = {
  date: string;      // "YYYY-MM-DD"
  checked: boolean;
};

type MiniCalendarProps = {
  // novo (recomendado): estado real por dia
  week?: MiniCalendarDay[];

  // legado (fallback): 0..7 (marca os primeiros N)
  checkedDays?: number;

  className?: string;
  labels?: string[]; // opcional (pt/en)
};

export default function MiniCalendar({
  week,
  checkedDays = 0,
  className = '',
  labels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'],
}: MiniCalendarProps) {
  const days = week?.length === 7
    ? week.map((d) => ({ checked: !!d.checked }))
    : labels.map((_, i) => ({ checked: i < checkedDays }));

  return (
    <div className={`mt-4 rounded-2xl bg-black/20 p-3 ring-1 ring-white/10 ${className}`}>
      <div className='grid grid-cols-7 gap-2'>
        {labels.map((label, i) => {
          const done = !!days[i]?.checked;

          return (
            <div key={`${label}-${i}`} className='flex flex-col items-center'>
              <span className='text-[10px] font-medium text-white/45'>{label}</span>

              <div className='mt-1 flex h-6 items-center justify-center'>
                {done ? (
                  <FaCheck
                    className='text-[#39FF14] drop-shadow-[0_6px_16px_rgba(57,255,20,0.18)]'
                    size={18}
                  />
                ) : (
                  <FaMinus className='text-white/25' size={16} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
