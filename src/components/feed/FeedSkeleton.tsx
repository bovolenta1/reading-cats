'use client';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ring-1 ring-white/10 ${className}`} />;
}

export default function FeedSkeleton() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6'>
      {/* Top row: Streak + CTA */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 lg:col-span-2'>
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0'>
              <Skeleton className='h-5 w-44' />
              <div className='mt-2 flex gap-2'>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-6 w-28 rounded-full' />
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>
              <Skeleton className='mt-4 h-3 w-72' />
            </div>
            <Skeleton className='h-14 w-14 rounded-2xl' />
          </div>

          <div className='mt-5'>
            <Skeleton className='h-2 w-full rounded-full' />
            <div className='mt-3 grid grid-cols-7 gap-2'>
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className='h-8 w-full rounded-xl' />
              ))}
            </div>
          </div>
        </div>

        <div className='rounded-3xl bg-white/5 p-5 ring-1 ring-white/10'>
          <Skeleton className='h-4 w-36' />
          <Skeleton className='mt-3 h-10 w-full rounded-2xl' />
          <Skeleton className='mt-2 h-10 w-full rounded-2xl' />
          <Skeleton className='mt-2 h-10 w-full rounded-2xl' />
          <Skeleton className='mt-4 h-3 w-40' />
        </div>
      </div>

      {/* Groups section */}
      <div className='mt-6 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10'>
        <div className='flex items-center justify-between gap-3'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-9 w-28 rounded-2xl' />
        </div>

        <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className='rounded-3xl bg-black/20 p-4 ring-1 ring-white/10'>
              <div className='flex items-start gap-3'>
                <Skeleton className='h-12 w-12 rounded-2xl' />
                <div className='min-w-0 flex-1'>
                  <Skeleton className='h-4 w-40' />
                  <div className='mt-2 flex gap-2'>
                    <Skeleton className='h-5 w-16 rounded-full' />
                    <Skeleton className='h-5 w-24 rounded-full' />
                  </div>
                </div>
                <Skeleton className='h-7 w-14 rounded-xl' />
              </div>

              <div className='mt-4'>
                <Skeleton className='h-2 w-full rounded-full' />
                <div className='mt-3 flex -space-x-2'>
                  {Array.from({ length: 5 }).map((__, i) => (
                    <Skeleton key={i} className='h-9 w-9 rounded-full' />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-4 flex justify-center'>
          <Skeleton className='h-10 w-44 rounded-2xl' />
        </div>
      </div>

      {/* Feed cards */}
      <div className='mt-6 space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='rounded-3xl bg-white/5 p-5 ring-1 ring-white/10'>
            <div className='flex items-start gap-3'>
              <Skeleton className='h-11 w-11 rounded-full' />
              <div className='min-w-0 flex-1'>
                <Skeleton className='h-4 w-52' />
                <Skeleton className='mt-2 h-3 w-72' />
              </div>
              <Skeleton className='h-9 w-9 rounded-xl' />
            </div>

            <div className='mt-4 space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-11/12' />
              <Skeleton className='h-3 w-9/12' />
            </div>

            <div className='mt-4 flex gap-2'>
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-6 w-16 rounded-full' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
