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
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs';

interface CheckoutSessionResponse {
  sessionId: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const SubscriptionModal = ({ onClose }: { onClose: () => void }) => {
  const [plans, setPlans] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    fetch('/api/subscription-plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  const handleSubscribe = async (priceId: string): Promise<void> => {
    const stripe = await stripePromise;
    const { sessionId }: CheckoutSessionResponse = await fetch(
      '/api/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId: user?.id }),
      }
    ).then(res => res.json());

    if (!stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-6/12 h-fit !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6 shadow-red-500/10">
        <FixedElement />
        <DialogHeader className="h-fit">
          <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter text-left">
            Chcesz przeglądać więcej aktów prawnych?
          </DialogTitle>
          <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
            Kup subskrypcję i zyskaj dostęp do pełnej treści aktów prawnych.
          </DialogDescription>
        </DialogHeader>
        <ProductsWrapper plans={plans} handleSubscribe={handleSubscribe} />
      </DialogContent>
    </Dialog>
  );
};

const ProductsWrapper = ({
  plans,
  handleSubscribe,
}: {
  plans: SubscriptionPlan[];
  handleSubscribe: (priceId: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4 text-left text-sm">
      <label className="flex items-start gap-2">
        <input type="checkbox" required className="mt-1" />
        <span>
          Wyrażam zgodę na rozpoczęcie świadczenia usługi przed upływem terminu
          odstąpienia i przyjmuję do wiadomości, że tracę prawo do odstąpienia
          od umowy.
        </span>
      </label>

      <div className="flex gap-4">
        {plans.map(plan => (
          <Product
            key={plan.id}
            plan={plan}
            handleSubscribe={handleSubscribe}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-500">
        Subskrypcja odnawia się automatycznie co miesiąc. Możesz anulować w
        dowolnym momencie w ustawieniach swojego konta Stripe. <br />
        <a href="/regulamin" className="underline">
          Regulamin
        </a>{' '}
        |{' '}
        <a href="/polityka-prywatnosci" className="underline">
          Polityka prywatności
        </a>
      </p>
    </div>
  );
};

const Product = ({
  plan,
  handleSubscribe,
}: {
  plan: SubscriptionPlan;
  handleSubscribe: (priceId: string) => void;
}) => {
  return (
    <div
      key={plan.id}
      className="w-fit text-lg px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      <div className="description Box-root">
        <h3>{plan.name}</h3>
        <p>{plan.description}</p>
        <p>
          Price: ${plan.price / 100} / {plan.interval}
        </p>
        <button onClick={() => handleSubscribe(plan.price_id)}>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
