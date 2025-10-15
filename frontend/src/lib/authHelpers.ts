import { useUser } from '@clerk/nextjs';

export const useIsAdmin = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === 'admin';
};

export const isLowConfidence = (confidenceScore?: number | null): boolean => {
  const CONFIDENCE_THRESHOLD = 0.5;
  return (
    confidenceScore !== null &&
    confidenceScore !== undefined &&
    confidenceScore < CONFIDENCE_THRESHOLD
  );
};
