import { createClerkClient } from '@clerk/backend';
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  const user = await clerkClient.users.getUser(userId);
  const currentClicks = Number(user.unsafeMetadata?.clicks_this_month ?? 0);

  const newClicks = currentClicks + 1;

  await clerkClient.users.updateUserMetadata(userId, {
    unsafeMetadata: {
      clicks_this_month: newClicks,
    },
  });

  return Response.json({ success: true, clicks_this_month: newClicks });
};
