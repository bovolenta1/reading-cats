'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiApple } from 'react-icons/si';
import Toast from '@/src/components/ui/Toast';

export default function LoginPanel() {
  const [showAppleToast, setShowAppleToast] = useState(false);
  const secondaryBtn =
    'w-full flex rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 active:scale-[0.99] justify-center cursor-pointer';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-white/60">Entre com sua conta para começar a ler e compartilhar desafios com amigos.</p>
      </div>

      <div className="space-y-3">
        <button type="button" onClick={() => (window.location.href = '/api/auth/google')} className={secondaryBtn}>
          <span className="inline-flex items-center justify-center gap-2">
            <FcGoogle className="h-5 w-5" />
            Entrar com Google
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowAppleToast(true)}
          className={secondaryBtn}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <SiApple className="h-5 w-5" />
            Entrar com Apple
          </span>
        </button>
      </div>

      <div className="space-y-2 pt-4 text-xs text-white/45">
        <p>Ao continuar, você concorda com nossos termos e política de privacidade.</p>
      </div>

      <Toast
        open={showAppleToast}
        type="error"
        title="Ainda vai demorar pra implementar, caro demais!!!"
        onClose={() => setShowAppleToast(false)}
      />
    </div>
  );
}
