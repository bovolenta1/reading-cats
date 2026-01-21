'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const otpValue = useMemo(() => otp.join(''), [otp]);
  const normalizedEmail = email.trim().toLowerCase();
  const canSubmitEmail = isValidEmail(normalizedEmail);
  const canSubmitOtp = otpValue.length === 6 && otp.every((d) => d !== '');

  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  async function onSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmitEmail) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const r = await fetch('/api/auth/otp/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await r.json().catch(() => ({}))) as any;

      if (!r.ok) {
        setErrorMsg(
          data?.error
            ? `Não foi possível enviar o código (${data.error}).`
            : 'Não foi possível enviar o código. Tente novamente.'
        );
        return;
      }

      setOtp(Array(6).fill(''));
      setStep('otp');
    } catch {
      setErrorMsg('Falha de rede ao enviar o código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmitOtp) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const r = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: otpValue }),
      });

      const data = (await r.json().catch(() => ({}))) as any;

      if (!r.ok) {
        setErrorMsg(
          data?.error
            ? `Código inválido ou expirado (${data.error}).`
            : 'Código inválido ou expirado. Tente novamente.'
        );
        return;
      }

      // Cookies foram setados no response do verify.
      window.location.href = data?.redirectTo || '/feed';
    } catch {
      setErrorMsg('Falha de rede ao verificar o código. Tente novamente.');
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
    setErrorMsg(null);
  }

  function clearOtp() {
    setOtp(Array(6).fill(''));
    otpRefs.current[0]?.focus();
    setErrorMsg(null);
  }

  const showEmail = step === 'email';
  const showOtp = step === 'otp';

  const panelBase = 'transition-all duration-300 ease-out will-change-transform will-change-opacity';
  const visible = 'opacity-100 translate-y-0 pointer-events-auto';
  const hiddenUp = 'opacity-0 -translate-y-2 pointer-events-none';
  const hiddenDown = 'opacity-0 translate-y-2 pointer-events-none';

  const inputBase =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20';

  const primaryBtn =
    'w-full cursor-pointer rounded-2xl bg-[#39FF14] px-4 py-3 text-sm font-semibold text-[#0F0C22] shadow-lg shadow-[#39FF14]/10 transition hover:brightness-110 disabled:opacity-60 active:scale-[0.99]';

  const secondaryBtn =
    'w-full flex rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 active:scale-[0.99] justify-center cursor-pointer';

  const subtleLink = 'text-xs text-white/55 hover:text-white/85 transition';

  return (
    <div>
      <div className="relative min-h-[72px]">
        <div className={`${panelBase} ${showEmail ? visible : hiddenUp}`} aria-hidden={!showEmail}>
          <h1 className="text-2xl font-semibold text-white">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-white/60">Vamos te mandar um código para entrar sem senha.</p>
        </div>

        <div className={`absolute inset-0 ${panelBase} ${showOtp ? visible : hiddenDown}`} aria-hidden={!showOtp}>
          <h1 className="text-2xl font-semibold text-white">Digite o código</h1>
          <p className="mt-2 text-sm text-white/60">
            Enviamos um código de 6 dígitos para <span className="text-white/85">{normalizedEmail}</span>.
          </p>
        </div>
      </div>

      {errorMsg ? (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-white/85">
          {errorMsg}
        </div>
      ) : null}

      <div className="relative mt-6">
        <div className={`${panelBase} ${showEmail ? visible : hiddenUp}`}>
          <form onSubmit={onSendLink} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/80">Email</label>
              <div className="mt-2">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </div>
              {!canSubmitEmail && email.length > 2 ? (
                <p className="mt-2 text-xs text-white/45">Digite um email válido.</p>
              ) : null}
            </div>

            <button type="submit" disabled={loading || !canSubmitEmail} className={primaryBtn}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/40">ou</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button type="button" onClick={() => (window.location.href = '/api/auth/google')} className={secondaryBtn}>
              <span className="inline-flex items-center justify-center gap-2">
                <FcGoogle className="h-5 w-5" />
                Entrar com Google
              </span>
            </button>

            <p className="pt-2 text-xs text-white/45">Ao continuar, você concorda com nossos termos e política de privacidade.</p>

            <div className="pt-2 text-xs text-white/40">Dica: se não achar o email, veja o spam.</div>
            <div className="pt-2 text-xs text-white/20">PS: por enquanto o OTP funciona apenas para emails que eu (Eduardo)
                liberei para uso. Entre usando o Google!</div>
          </form>
        </div>

        <div className={`absolute inset-0 ${panelBase} ${showOtp ? visible : hiddenDown}`}>
          <form onSubmit={onVerifyOtp} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/80">Código (6 dígitos)</label>

              <div className="mt-3 flex gap-2 sm:gap-3">
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label={`Dígito ${i + 1}`}
                    className="h-12 w-10 rounded-2xl border border-white/10 bg-white/5 text-center text-lg font-semibold text-white outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20 sm:h-14 sm:w-12"
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button type="button" onClick={goBackToEmail} className={subtleLink}>
                  Trocar email
                </button>

                <button type="button" onClick={clearOtp} className={subtleLink}>
                  Limpar
                </button>
              </div>

              <p className="mt-3 text-xs text-white/45">
                Dica: você pode colar o código inteiro no primeiro campo.
              </p>
            </div>

            <button type="submit" disabled={loading || !canSubmitOtp} className={primaryBtn}>
              {loading ? 'Verificando...' : 'Confirmar código'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
