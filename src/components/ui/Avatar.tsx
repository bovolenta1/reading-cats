export default function Avatar({ name }: { name: string }) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?';

  return (
    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/90 ring-1 ring-white/10'>
      {initial}
    </div>
  );
}