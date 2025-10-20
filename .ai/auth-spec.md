# Specyfikacja Techniczna: Moduł Autentykacji Użytkowników

## 1. Wprowadzenie

Dokument opisuje architekturę funkcjonalności rejestracji, logowania i
zarządzania kontem użytkownika w oparciu o usługę Clerk, zgodnie z wymaganiami
PRD (US-003, US-005, US-006).

## 2. Architektura Interfejsu Użytkownika (Frontend)

Interfejs użytkownika będzie w pełni oparty o komponenty dostarczane przez
bibliotekę `@clerk/nextjs`, co minimalizuje potrzebę tworzenia własnych
formularzy.

### 2.1. Konfiguracja globalna

- **`ClerkProvider`**: W głównym layoucie (`frontend/src/app/layout.tsx`)
  `ClerkProvider` dostarcza kontekst autentykacji w całej aplikacji, zarządza
  tłumaczeniami (`plPL`) oraz dba o spójny wygląd komponentów Clerk.

### 2.2. Komponenty UI

- **`AuthButtons.tsx`**: Komponent w `Navbarze` służący do interakcji z systemem
  autentykacji. Renderuje:

  - **`SignInButton` i `SignUpButton`**: Przyciski dla gości, które otwierają
    modal Clerk do logowania lub rejestracji.
  - **`UserButton`**: Ikona dla zalogowanych użytkowników, dająca dostęp do
    panelu zarządzania kontem i opcji wylogowania.

- **Modale Clerk**: Formularze logowania, rejestracji, odzyskiwania hasła i
  zarządzania kontem są renderowane jako gotowe modale od Clerk, które
  zapewniają walidację i obsługę błędów.

- **Strony dedykowane (`/sign-in`, `/sign-up`, `/user-profile`)**: Clerk
  automatycznie generuje i obsługuje te ścieżki, a ich wygląd jest konfigurowany
  centralnie w `ClerkProvider`.

### 2.3. Scenariusze Użytkownika

#### 2.3.1. Rejestracja, Logowanie, Wylogowanie (US-005)

- **Rejestracja/Logowanie**: Użytkownik inicjuje proces poprzez `AuthButtons`,
  co otwiera odpowiedni modal Clerk. Obsługiwane jest logowanie przez
  email/hasło oraz dostawców OAuth.
- **Wylogowanie**: Użytkownik wylogowuje się poprzez opcję w menu dostępnym pod
  `UserButton`.

#### 2.3.2. Ograniczenie dostępu dla gości (US-003)

- **`useModalLimit` Hook**: Hook (`frontend/src/app/hooks/useModalLimit.ts`)
  zlicza w `localStorage` liczbę wyświetleń pełnych treści aktów prawnych przez
  niezalogowanych użytkowników.
- **`LimitReachedModal.tsx`**: Nowy komponent modalny, który jest wyświetlany po
  przekroczeniu limitu 3 odczytów. Zawiera komunikat o limicie oraz przyciski
  `<SignInButton>` i `<SignUpButton>`, zachęcające do założenia konta lub
  zalogowania się.

## 3. Logika Backendowa (Next.js)

### 3.1. Middleware (`frontend/src/middleware.ts`)

- **`clerkMiddleware`**: Middleware przechwytuje wszystkie żądania, zarządza
  sesją użytkownika i udostępnia dane autentykacji do komponentów serwerowych i
  API routes. Trasy publiczne i chronione są definiowane w konfiguracji.

### 3.2. Endpointy API

- **Zabezpieczanie Endpointów**: Endpointy wymagające autentykacji (np.
  `POST /api/admin/update-act`) są zabezpieczone poprzez wywołanie funkcji
  `auth()` z `@clerk/nextjs/server` na początku ich logiki. Funkcja ta
  weryfikuje sesję oraz rolę użytkownika zapisaną w metadanych.

## 4. System Autentykacji (Clerk)

### 4.1. Model danych użytkownika

- Dane użytkowników (ID, email, metadane, role) są zarządzane wyłącznie przez
  Clerk. Aplikacja nie przechowuje tych informacji we własnej bazie danych.
  Powiązanie z danymi aplikacji odbywa się poprzez `userId` z Clerk.

### 4.2. Zarządzanie rolami (Admin, User)

- **Definicja i weryfikacja ról**: Role (np. `admin`) są przypisywane w panelu
  Clerk i przechowywane w `publicMetadata`. Dostęp do funkcji administracyjnych
  jest weryfikowany na frontendzie (za pomocą hooka `useIsAdmin`) i na
  backendzie (poprzez `auth().sessionClaims.metadata.role`).
