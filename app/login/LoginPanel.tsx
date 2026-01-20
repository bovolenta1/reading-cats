'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Step = 'email' | 'otp';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPanel() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = useMemo(() => otp.join(''), [otp]);
  const canSubmitOtp = otpValue.length === 6 && otp.every((d) => d !== '');

  useEffect(() => {
    if (step === 'otp') {
      // pequeno delay para deixar a transição começar antes do focus
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  async function onSendLink(e: React.FormEvent) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) return;

    setLoading(true);
    try {
      // Depois: chamar endpoint real
      // await fetch("/api/auth/request-link", { ... })

      // transição: troca step
      setOtp(Array(6).fill(''));
      setStep('otp');
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmitOtp) return;

    setLoading(true);
    try {
      console.log('Verify OTP:', { email: email.trim().toLowerCase(), otp: otpValue });
    } finally {
      setLoading(false);
    }
  }

  function setDigit(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
        return;
      }
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtp((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;

    e.preventDefault();
    const chars = text.split('');

    setOtp(() => {
      const next = Array(6).fill('');
      for (let i = 0; i < 6; i++) next[i] = chars[i] ?? '';
      return next;
    });

    otpRefs.current[Math.min(text.length, 6) - 1]?.focus();
  }

  function goBackToEmail() {
    setStep('email');
    setOtp(Array(6).fill(''));
  }

  // classes utilitárias pra transição
  const showEmail = step === 'email';
  const showOtp = step === 'otp';

  const panelBase = 'transition-all duration-300 ease-out will-change-transform will-change-opacity';

  const visible = 'opacity-100 translate-y-0 pointer-events-auto';
  const hiddenUp = 'opacity-0 -translate-y-2 pointer-events-none';
  const hiddenDown = 'opacity-0 translate-y-2 pointer-events-none';

  return (
    <div>
      {/* Header com transição também */}
      <div className='relative'>
        <div className={`${panelBase} ${showEmail ? visible : hiddenUp}`} aria-hidden={!showEmail}>
          <h1 className='text-2xl font-semibold text-white'>Bem-vindo de volta</h1>
          <p className='mt-2 text-sm text-white/60'>Vamos te mandar um link mágico para entrar sem senha.</p>
        </div>

        <div className={`absolute inset-0 ${panelBase} ${showOtp ? visible : hiddenDown}`} aria-hidden={!showOtp}>
          <h1 className='text-2xl font-semibold text-white'>Digite o código</h1>
          <p className='mt-2 text-sm text-white/60'>
            Enviamos um código de 6 dígitos para <span className='text-white/80'>{email.trim().toLowerCase()}</span>.
          </p>
        </div>
      </div>

      {/* Body: Email + OTP (crossfade) */}
      <div className='relative mt-6'>
        {/* EMAIL */}
        <div className={`${panelBase} ${showEmail ? visible : hiddenUp}`}>
          <form onSubmit={onSendLink} className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-white/80'>Email</label>
              <div className='mt-2'>
                <input
                  type='email'
                  autoComplete='email'
                  placeholder='voce@exemplo.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading || !isValidEmail(email.trim().toLowerCase())}
              className='w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#1F1B3A] transition hover:bg-white/90 disabled:opacity-60 active:scale-[0.99]'
            >
              {loading ? 'Enviando...' : 'Enviar link mágico'}
            </button>

            <div className='flex items-center gap-3'>
              <div className='h-px flex-1 bg-white/10' />
              <span className='text-xs text-white/40'>ou</span>
              <div className='h-px flex-1 bg-white/10' />
            </div>

            <button
              type='button'
              onClick={() => (window.location.href = '/api/auth/google')}
              className='w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 active:scale-[0.99]'
            >
              Entrar com Google
            </button>

            <p className='pt-2 text-xs text-white/45'>Ao continuar, você concorda com nossos termos e política de privacidade.</p>

            <div className='mt-10 text-xs text-white/40'>Dica: se não achar o email, veja o spam.</div>
          </form>
        </div>

        {/* OTP (absoluto pra fazer crossfade sem empurrar layout) */}
        <div className={`absolute inset-0 ${panelBase} ${showOtp ? visible : hiddenDown}`}>
          <form onSubmit={onVerifyOtp} className='space-y-5'>
            <div>
              <label className='text-sm font-medium text-white/80'>Código (6 dígitos)</label>

              <div className='mt-3 flex gap-2 sm:gap-3'>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={i === 0 ? onPaste : undefined}
                    inputMode='numeric'
                    pattern='[0-9]*'
                    maxLength={1}
                    aria-label={`Dígito ${i + 1}`}
                    className='h-12 w-10 rounded-2xl border border-white/10 bg-black/20 text-center text-lg font-semibold text-white outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20 sm:h-14 sm:w-12'
                  />
                ))}
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <button type='button' onClick={goBackToEmail} className='text-xs text-white/55 hover:text-white/80'>
                  Trocar email
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setOtp(Array(6).fill(''));
                    otpRefs.current[0]?.focus();
                  }}
                  className='text-xs text-white/55 hover:text-white/80'
                >
                  Limpar
                </button>
              </div>

              <p className='mt-3 text-xs text-white/45'>Dica: você pode colar o código inteiro no primeiro campo.</p>
            </div>

            <button
              type='submit'
              disabled={loading || !canSubmitOtp}
              className='w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#1F1B3A] transition hover:bg-white/90 disabled:opacity-60 active:scale-[0.99]'
            >
              {loading ? 'Verificando...' : 'Confirmar código'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
