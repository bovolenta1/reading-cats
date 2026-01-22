import React from 'react';
import PawLikeButton from '@/src/components/feed/PawLikeButton';
import Avatar from '../ui/Avatar';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/70 ring-1 ring-white/10'>
      {children}
    </span>
  );
}

export type PostCardProps = {
  name: string;
  handle: string;
  time: string;
  text: string;
  tags?: string[];
  likes: number;
  replies: number;
  saves: number;
};

export default function PostCard({
  name,
  handle,
  time,
  text,
  tags,
  likes,
  replies,
  saves,
}: PostCardProps) {
  return (
    <article className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'>
      <div className='flex items-start gap-3'>
        <Avatar name={name} />

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span className='font-semibold text-white'>{name}</span>
            <span className='text-sm text-white/60'>@{handle}</span>
            <span className='text-sm text-white/40'>· {time}</span>
          </div>

          <p className='mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/85'>
            {text}
          </p>

          {tags?.length ? (
            <div className='mt-3 flex flex-wrap gap-2'>
              {tags.map((t) => (
                <Badge key={t}>#{t}</Badge>
              ))}
            </div>
          ) : null}

          <div className='mt-4 flex items-center gap-2 text-sm text-white/60'>
            <button className='cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5'>
              💬 <span>{replies}</span>
            </button>

            <PawLikeButton initialCount={likes} />

            <button className='cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5'>
              🔖 <span>{saves}</span>
            </button>

            <div className='ml-auto'>
              <button className='cursor-pointer rounded-xl px-2 py-1 hover:bg-white/5'>
                ⋯
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
