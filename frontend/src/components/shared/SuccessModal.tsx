'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import FixedElement from './FixedElement';
import { useEffect, useState } from 'react';
import { Stripe } from 'stripe';

const SubscriptionModal = () => {
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => setSession(data));
    }
  }, []);

  if (!session) return null;

  const onClose = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setSession(null);
  };

  const isPaid = session.payment_status === 'paid';

  const title = isPaid ? 'Udało się! Masz subskrypcję! 🎉' : 'Wystąpił błąd';

  const description = isPaid
    ? 'Lecisz z tematem i patrz co możesz zobaczyć!'
    : 'Nie udało się przetworzyć subskrypcji. Spróbuj ponownie lub skontaktuj się z pomocą.';

  const titleClass = isPaid
    ? 'text-2xl font-bold leading-tight tracking-tighter text-left'
    : 'text-2xl font-bold leading-tight tracking-tighter text-left text-red-600';

  const buttonLabel = isPaid ? 'Rozpocznij korzystanie' : 'Zamknij';

  const buttonClass = isPaid
    ? 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
    : 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-6/12 h-fit !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6 shadow-red-500/10">
        {isPaid && <FixedElement />}
        <DialogHeader className="h-fit">
          <DialogTitle className={titleClass}>{title}</DialogTitle>
          <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className={buttonClass}>
            {buttonLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
