import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const AuthButtons = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <SignedOut>
      <div
        className={`flex items-start justify-center flex-col gap-2 absolute top-6 transition-all duration-300 -z-10 opacity-0 border-t-[1px] border-white/50 pt-5
        ${
          isOpen &&
          'opacity-100 !pointer-events-auto translate-x-12 translate-y-15 z-0'
        }`}
      >
        <SignedOut>
          <SignUpButton>
            <button className={`cursor-pointer text-sm leading-3.5`}>
              Zarejestruj się
            </button>
          </SignUpButton>
          <SignInButton>
            <button className={`cursor-pointer text-sm leading-3.5`}>
              Zaloguj się
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </SignedOut>
  );
};

export default AuthButtons;
