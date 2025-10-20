# Diagram Podróży Użytkownika - Moduł Autentykacji i Dostępu

Ten diagram przedstawia kompletną podróż użytkownika w aplikacji "Co się dzieje
w Polsce", uwzględniając proces autentykacji, ograniczenia dostępu oraz
subskrypcję.

```mermaid
stateDiagram-v2
    [*] --> StronaGlowna

    state "Strona Główna" as StronaGlowna {
        [*] --> PrzegladanieKafelkow
        PrzegladanieKafelkow --> SprawdzenieStatusu
    }

    state SprawdzenieStatusu <<choice>>
    StronaGlowna --> SprawdzenieStatusu
    SprawdzenieStatusu --> UzytkownikAnonimowy: Niezalogowany
    SprawdzenieStatusu --> UzytkownikZalogowany: Zalogowany
    SprawdzenieStatusu --> Administrator: Zalogowany jako admin

    state "Użytkownik Anonimowy" as UzytkownikAnonimowy {
        [*] --> PrzegladanieAktow
        PrzegladanieAktow --> KlikniecieTresci
        KlikniecieTresci --> SprawdzenieLimitu3

        state SprawdzenieLimitu3 <<choice>>
        SprawdzenieLimitu3 --> WyswietlenieModaluAktu: Limit nie przekroczony
        SprawdzenieLimitu3 --> ModalLimitOsiagnietyAnonim: Limit 3 treści przekroczony

        WyswietlenieModaluAktu --> ZwiekszenieLicznika
        ZwiekszenieLicznika --> PrzegladanieAktow

        state "Modal Limit Osiągnięty" as ModalLimitOsiagnietyAnonim {
            [*] --> KomunikatOLimicie
            KomunikatOLimicie --> WyborAkcji
        }
    }

    ModalLimitOsiagnietyAnonim --> DecyzjaLogowanieRejestracja

    state DecyzjaLogowanieRejestracja <<choice>>
    DecyzjaLogowanieRejestracja --> ProcesLogowania: Kliknięcie Zaloguj się
    DecyzjaLogowanieRejestracja --> ProcesRejestracji: Kliknięcie Zarejestruj się
    DecyzjaLogowanieRejestracja --> PrzegladanieAktow: Zamknięcie modala

    state "Proces Rejestracji" as ProcesRejestracji {
        [*] --> OtwarcieModaluClerkRejestracja
        OtwarcieModaluClerkRejestracja --> WypelnienieFormularzaRejestracji

        state "Wypełnienie Formularza" as WypelnienieFormularzaRejestracji {
            [*] --> WybórMetody

            state WybórMetody <<choice>>
            WybórMetody --> RejestracjaEmail: Email i hasło
            WybórMetody --> RejestracjaOAuth: OAuth (Google, Facebook)

            RejestracjaEmail --> WalidacjaDanych
            RejestracjaOAuth --> WalidacjaDanych
        }

        WypelnienieFormularzaRejestracji --> WeryfikacjaClerk

        state WeryfikacjaClerk <<choice>>
        WeryfikacjaClerk --> UtworzenieSesji: Dane poprawne
        WeryfikacjaClerk --> BladRejestracji: Dane niepoprawne

        BladRejestracji --> WypelnienieFormularzaRejestracji
        UtworzenieSesji --> AutomatyczneZalogowanie
    }

    state "Proces Logowania" as ProcesLogowania {
        [*] --> OtwarcieModaluClerkLogowanie
        OtwarcieModaluClerkLogowanie --> WypelnienieFormularzaLogowania

        state "Wypełnienie Formularza Logowania" as WypelnienieFormularzaLogowania {
            [*] --> WyborMetodyLogowania

            state WyborMetodyLogowania <<choice>>
            WyborMetodyLogowania --> LogowanieEmail: Email i hasło
            WyborMetodyLogowania --> LogowanieOAuth: OAuth
            WyborMetodyLogowania --> OdzyskiwanieHasla: Zapomniałem hasła

            LogowanieEmail --> WeryfikacjaDanychLogowania
            LogowanieOAuth --> WeryfikacjaDanychLogowania
        }

        WypelnienieFormularzaLogowania --> WeryfikacjaDanychLogowania

        state WeryfikacjaDanychLogowania <<choice>>
        WeryfikacjaDanychLogowania --> UtworzenieSesjiLogowanie: Dane poprawne
        WeryfikacjaDanychLogowania --> BladLogowania: Dane niepoprawne

        BladLogowania --> WypelnienieFormularzaLogowania
        UtworzenieSesjiLogowanie --> ZalogowanyUzytkownik
    }

    state "Odzyskiwanie Hasła" as OdzyskiwanieHasla {
        [*] --> WpisanieEmaila
        WpisanieEmaila --> WyslanieLinku
        WyslanieLinku --> PotwierdzenieMail

        note right of PotwierdzenieMail
            Użytkownik otrzymuje email
            z linkiem do resetu hasła
        end note

        PotwierdzenieMail --> KlikniecieLinkuReset
        KlikniecieLinkuReset --> UstawienieNowegoHasla
        UstawienieNowegoHasla --> HasloZmienione
    }

    HasloZmienione --> ProcesLogowania

    AutomatyczneZalogowanie --> UzytkownikZalogowany
    ZalogowanyUzytkownik --> UzytkownikZalogowany

    state "Użytkownik Zalogowany" as UzytkownikZalogowany {
        [*] --> NielimitowanyDostep
        NielimitowanyDostep --> OtwieranieAktowBezLimitu
        OtwieranieAktowBezLimitu --> PrzegladanieModali
        PrzegladanieModali --> NielimitowanyDostep

        note right of NielimitowanyDostep
            Użytkownik zalogowany
            ma nielimitowany dostęp
        end note
    }

    state "Administrator" as Administrator {
        [*] --> RozszerzonyDostep
        RozszerzonyDostep --> PrzegladanieWszystkichAktow

        note right of PrzegladanieWszystkichAktow
            Widzi również akty o niskiej
            confidence_score (<0.7)
        end note

        PrzegladanieWszystkichAktow --> DostepDoFunkcjiAdmin
        DostepDoFunkcjiAdmin --> RozszerzonyDostep
    }

    state "Zarządzanie Kontem" as ZarzadzanieKontem {
        [*] --> KliknieciePrzyciskuUser
        KliknieciePrzyciskuUser --> OtwarcieMenuClerk

        state "Menu Clerk" as OtwarcieMenuClerk {
            [*] --> WyborOpcji

            state WyborOpcji <<choice>>
            WyborOpcji --> ZarzadzanieProfilem: Profil
            WyborOpcji --> ZmianaBezpieczenstwa: Bezpieczeństwo
            WyborOpcji --> Wylogowanie: Wyloguj

            state "Zarządzanie Profilem" as ZarzadzanieProfilem {
                [*] --> EdycjaDanych
                EdycjaDanych --> AktualizacjaAvatara
                AktualizacjaAvatara --> ZapisanieZmian
            }

            state "Zmiana Bezpieczeństwa" as ZmianaBezpieczenstwa {
                [*] --> ZmianaHasla
                ZmianaHasla --> DodanieMetodyOAuth
                DodanieMetodyOAuth --> Dwuskladnikowa
            }
        }

        ZarzadzanieProfilem --> OtwarcieMenuClerk
        ZmianaBezpieczenstwa --> OtwarcieMenuClerk
    }

    UzytkownikZalogowany --> ZarzadzanieKontem: Kliknięcie UserButton
    Administrator --> ZarzadzanieKontem: Kliknięcie UserButton

    ZarzadzanieKontem --> UzytkownikZalogowany: Powrót
    ZarzadzanieKontem --> Administrator: Powrót

    Wylogowanie --> WyczyszczenieSesji
    WyczyszczenieSesji --> StronaGlowna

    note right of StronaGlowna
        ClerkProvider dostarcza kontekst autentykacji.
        Middleware weryfikuje sesję na każdym żądaniu.
    end note

    StronaGlowna --> [*]: Opuszczenie strony
```

## Kluczowe Elementy Podróży

### 1. Użytkownik Anonimowy

- **Limit:** 3 otwarcia treści aktów prawnych (weryfikacja `localStorage`)
- **Akcja po przekroczeniu:** Modal z przyciskami "Zaloguj się" i "Zarejestruj
  się"

### 2. Proces Rejestracji i Logowania

- **Provider:** Clerk obsługuje całą logikę autentykacji
- **Metody:** Email/hasło oraz OAuth (Google, Facebook)
- **Komponenty:** `SignInButton`, `SignUpButton` w `AuthButtons.tsx`
- **Modale:** Gotowe komponenty Clerk z walidacją

### 3. Użytkownik Zalogowany

- **Dostęp:** Nielimitowany dostęp do wszystkich treści

### 4. Administrator

- **Role:** Weryfikacja przez `user?.publicMetadata?.role === 'admin'`
- **Dodatkowe uprawnienia:** Widzi akty o `confidence_score < 0.7`

### 5. Zarządzanie Kontem

- **Komponent:** `UserButton` z Clerk
- **Funkcje:** Edycja profilu, zmiana hasła, wylogowanie

## Techniczne Detale Implementacji

### Hooki i Komponenty

- **`useModalLimit(limit)`**: Zarządza licznikiem otwarć w `localStorage` dla
  gości
- **`useUser()`**: Hook Clerk do dostępu do danych użytkownika
- **`useIsAdmin()`**: Helper do sprawdzania roli administratora
- **`ClerkProvider`**: Kontekst autentykacji w `layout.tsx`
- **`clerkMiddleware`**: Weryfikacja sesji w `middleware.ts`

### API Endpoints

- **`/api/admin/update-act`**: Chroniony endpoint dla adminów

### Stan i Zarządzanie

- **localStorage**: `modalOpens` - licznik otwarć dla gości
- **Clerk Metadata**:
  - `publicMetadata.role` - rola użytkownika
