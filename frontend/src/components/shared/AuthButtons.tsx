import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const AuthButtons = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <>
      <SignedOut>
        <div className="flex items-start justify-center gap-3 mb-[2px]">
          <SignInButton>
            <button
              className={`cursor-pointer text-sm leading-3.5 text-neutral-500 transition-colors ${
                isDarkMode ? 'hover:text-neutral-100' : 'hover:text-neutral-800'
              }`}
            >
              Zaloguj się
            </button>
          </SignInButton>
          <SignUpButton>
            <button
              className={`cursor-pointer text-sm leading-3.5 text-neutral-500 transition-colors ${
                isDarkMode ? 'hover:text-neutral-100' : 'hover:text-neutral-800'
              }`}
            >
              Zarejestruj się
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverMain:
                '!bg-neutral-700/10 dark:!bg-neutral-800/40 backdrop-blur-sm dark:!text-neutral-100 !text-neutral-900',
              userButtonPopoverFooter: '!hidden',
              userButtonPopoverActionButton:
                'dark:!text-neutral-100 !text-neutral-900',
            },
          }}
        />
      </SignedIn>
    </>
  );
};

export default AuthButtons;
