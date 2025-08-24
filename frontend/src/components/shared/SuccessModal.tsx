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
import { useSearchParams } from 'next/navigation';

const onClose = () => {
  console.log('Modal closed');
};

const SubscriptionModal = () => {
  const [status, setStatus] = useState('loading');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchSessionStatus();
    }
  }, [sessionId]);

  async function fetchSessionStatus() {
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
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Failed to process subscription. Please try again.</div>;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-6/12 h-fit !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6 shadow-red-500/10">
        <FixedElement />
        <DialogHeader className="h-fit">
          <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter text-left">
            Udało się! Masz subskrypcję!
          </DialogTitle>
          <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
            Lecisz z temat i patrz co mozesz zobaczyć!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default SubscriptionModal;
