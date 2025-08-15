'use client';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';

export const useModalLimit = (limit = 5) => {
  const { user } = useUser();
  const [count, setCount] = useState(0);
  const canOpen =
    user?.unsafeMetadata?.subscription_status === 'active' || count < limit;

  useEffect(() => {
    const saved = parseInt(
      localStorage.getItem('modalOpens') || count.toString(),
      10
    );
    setCount(saved);
  }, [count]);

  const registerOpen = useCallback(async () => {
    if (!canOpen) return;

    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('modalOpens', newCount.toString());

    try {
      await fetch('/api/update-modal-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
    } catch (err) {
      setCount(newCount - 1);
      localStorage.setItem('modalOpens', (newCount - 1).toString());
      console.error(err);
    }
  }, [canOpen, count, user?.id]);

  return { canOpen, count, registerOpen };
};
