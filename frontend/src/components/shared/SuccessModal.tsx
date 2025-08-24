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
import { useSearchParams, useRouter } from 'next/navigation';

const SubscriptionModal = () => {
  const [status, setStatus] = useState('loading');
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      setIsOpen(true);
      fetchSessionStatus();
    } else {
      setIsOpen(false);
    }
  }, [sessionId]);

  const onClose = () => {
    setIsOpen(false);
    router.replace('/', { scroll: false });
  };

  const fetchSessionStatus = async () => {
    try {
      const response = await fetch('/api/check-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const { session, error } = await response.json();

      if (error) {
        setStatus('failed');
        console.error(error);
        return;
      }

      setStatus(session.status);
    } catch (error) {
      console.error('Error fetching session:', error);
      setStatus('failed');
    }
  };

  if (!isOpen) return null;

  if (status === 'failed') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="overflow-auto w-6/12 h-fit !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6 shadow-red-500/10">
          <DialogHeader className="h-fit">
            <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter text-left text-red-600">
              Wystąpił błąd
            </DialogTitle>
            <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
              Nie udało się przetworzyć subskrypcji. Spróbuj ponownie lub
              skontaktuj się z pomocą.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-6/12 h-fit !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6 shadow-red-500/10">
        <FixedElement />
        <DialogHeader className="h-fit">
          <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter text-left">
            Udało się! Masz subskrypcję! 🎉
          </DialogTitle>
          <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
            Lecisz z tematem i patrz co możesz zobaczyć!
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Rozpocznij korzystanie
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
