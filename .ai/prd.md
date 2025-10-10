# Dokument wymagań produktu (PRD) - Co się dzieje w Polsce?

## 1. Przegląd produktu

Krótki opis: Aplikacja "Co się dzieje w Polsce?" dostarcza obywatelom zwięzłe,
przystępne streszczenia najważniejszych ustaw i rozporządzeń publikowanych w
Polsce. System pobiera metadane aktów z rządowego API, generuje uproszczone
podsumowania za pomocą modelu LLM (z parametrem verbosity) i prezentuje je
użytkownikom wraz z linkiem do oryginalnego PDF-a.

Cel MVP: Udostępnić działającą, stabilną aplikację umożliwiającą przeglądanie i
czytanie uproszczonych streszczeń aktów prawnych, z prostą kontrolą dostępu
(limit odczytów dla anonimów), panelem administracyjnym do weryfikacji i edycji
treści oraz zapleczem operacyjnym do ponownego przetwarzania brakujących danych.

Zakres czasowy MVP: podstawowa funkcjonalność produkcyjna z ingestem 2×
dziennie, workflow admina (draft/review/publish), oraz limitami dostępu (anonim
3 odczyty). Priorytet na stabilność backendu i mechanizmy reprocessingu.

## 2. Problem użytkownika

Główny problem: Obywatele mają trudność z szybkim zrozumieniem, które zmiany w
prawie ich dotyczą i w jaki sposób, oraz nie zawsze wiedzą, jak głosowały partie
polityczne.

Konsekwencje problemu:

- Niska transparentność procesu legislacyjnego.
- Trudność w podejmowaniu świadomych decyzji obywatelskich.
- Brak zaufania do źródeł informacji ze względu na ich złożoność.

W jaki sposób produkt rozwiązuje problem:

- Automatyczne dostarczanie krótkich, zrozumiałych streszczeń (różne formaty w
  zależności od typu aktu).
- Informacje o wpływie zmian na obywatela i podsumowanie kto i jak głosował.
- Panel admina do kontroli jakości i ręcznej weryfikacji streszczeń niskiego
  zaufania.

Grupa docelowa (MVP): przeciętny obywatel zainteresowany bieżącymi zmianami
prawa; użytkownicy anonimowi oraz zalogowani; administratorzy treści.

## 3. Wymagania funkcjonalne

3.1 Ingest i przetwarzanie danych

- Ingest job uruchamiany 2× dziennie (cron). (NF-001)
- Pobranie metadanych i linku do PDF z rządowego API; zapis minimalnych
  metadanych: title, act_number, refsm texts, item_type, announcment_data,
  change_date, promulgation, item_status, comment, keywords, file, (NF-002)
- Idempotentny pipeline: każdy rekord ma idempotency_key; ponowne uruchomienie
  nie powiela wpisów. (NF-003)
- Parsowanie metadanych i wysłanie tekstu (lub fragmentów) do LLM z parametrem
  verbosity (TL;DR / punkty / rozbudowane). (NF-004)
- Zapisywanie outputu LLM jako streszczenie + pole confidence/score. (NF-005)
- Routowanie właściwości: jeśli confidence < prog (konfigurowalny), wpis
  otrzymuje status "podejrzana" i trafia do kolejki admina. (NF-006)
- Retry/backoff i alerty operacyjne przy błędach ingestu; metryki błędów i
  logowanie. (NF-007)
- Job do ponownego pobrania brakujących PDFów lub brakujących danych
  (reprocess). (NF-008)

  3.2 Backend i przechowywanie

- Baza danych relacyjna (MVP): tabela dla aktów, streszczeń, metadanych ingest,
  użytkowników. (NF-009)
- Nie przechowujemy pełnych tekstów i PDF-ów w MVP (tylko linki). (NF-010)

  3.3 Frontend i prezentacja

- Strona główna z listą kafelków aktów (chronologicznie/od najnowszych). Każdy
  kafelek: tytuł, data, krótki snippet, tagi (np. sektor), status jezeli
  podejrzany. (NF-012)
- Widok szczegółowy aktu: streszczenie (format zależny od verbosity), sekcja
  "Jak to wpływa na obywatela", informacja o wynikach głosowania i stanowiskach
  partii (jeśli dostępne), link do oryginalnego PDF. (NF-013)
- Limit odczytów dla anonima: po przeczytaniu 3 pełnych streszczeń przeglądanie
  zostaje zablokowane (UI informuje o limicie i opcji zalogowania). (NF-014)
- Zalogowani użytkownicy: opcjonalne logowanie (Clerk) — role: user i admin;
  zalogowani użytkownicy mają zwiększony dostęp (w MVP: brak limitu lub
  konfigurowalny zwiększony limit). (NF-015)

  3.4 Panel admina

- Widok kolejki: nowe ingestowane wpisy, wpisy oznaczone jako
  "podejrzane"(NF-017)
- Edycja treści streszczenia: interfejs edycji WYSIWYG/markdown z możliwością
  zapisu publish. (NF-018)
- Mechanizm powiadomień (email/webhook) o nowych wpisach i elementach w kolejce
  "podejrzana". (NF-020)

  3.5 Operacje i utrzymanie

- Mechanizm reprocessingu: automatyczne triggerowanie re-ingestu dla
  pojedynczych rekordów. (NF-021)
- Dashboard operacyjny: liczba ingestów, procent błędów, ostatnie nieudane
  próby, liczba rekordów z missing_pdf lub missing_vote_data. (NF-022)
- Prosty mechanizm zgłaszania problemu pod streszczeniem — mailto lub webhook
  zapisujący metadane zgłoszenia. (NF-023)

  3.6 Bezpieczeństwo i zgodność

- Autoryzacja i uwierzytelnianie przez zewnętrzny provider (Clerk) z mapowaniem
  ról. (NF-024)
- Dane w spoczynku i w tranzycie zabezpieczone (HTTPS, szyfrowanie pól w bazie
  zgodne z polityką). (NF-025)
- Minimalna polityka dostępu: tylko admin może edytować i publikować. (NF-026)

  3.7 Konfiguracja LLM i monitoring jakości

- Parametr verbosity dostępny podczas generowania summary. (NF-027)
- Pole confidence/score w metadanych; metric routing gdy confidence < threshold
  (threshold konfigurowalny). (NF-028)

## 4. Granice produktu

Co jest w MVP (zwięzłe):

- Rejestracja i logowanie (opcjonalne); role user/admin. (B-001)
- Lista aktów z krótkimi podsumowaniami. (B-002)
- Limit dostępu: anonimowy użytkownik 3 odczyty. (B-003)
- Konto superadmina z możliwościami edycji i zatwierdzania. (B-004)
- Ingest 2× dziennie, dane + link do PDF. (B-005)
- Ukrywanie aktów dla niskiego confidence; potrzebne zatwierdzenie admina do
  edycji i publikacji. (B-006)
- Brak przechowywania pełnych tekstów/PDFów w MVP — tylko linki. (B-007)
- Prosty mechanizm zgłoszeń (mailto/webhook). (B-008)

Co nie wchodzi do MVP:

- System płatności / subskrypcji. (B-009)
- Generowanie contentu na platformy społecznościowe. (B-010)
- Zaawansowane rekomendacje/personalizacja. (B-011)
- Przechowywanie surowych tekstów / baza wektorowa. (B-012)
- Rozbudowany formularz zgłaszania błędów (tylko mailto/webhook). (B-013)

Ograniczenia techniczne:

- Model LLM i jego parametry są do wyboru po PoC; w MVP należy zaimplementować
  abstrakcję i fallback. (B-014)
- SLA ręcznej weryfikacji nie jest ustalony (do decyzji produktowej). (B-015)

## 5. Historyjki użytkowników

Uwaga: poniżej wszystkie niezbędne historyjki użytkownika, pogrupowane według
ról. Każda historyjka zawiera unikalny identyfikator (US-xxx), opis i kryteria
akceptacji. Wszystkie historyjki są testowalne.

---

### Rola: Anonimowy użytkownik / odwiedzający

US-001 Tytuł: Przeglądanie listy aktów (anonim) Opis: Jako anonimowy użytkownik
chcę zobaczyć listę najnowszych aktów z krótkimi podsumowaniami (kafelki), aby
szybko ocenić, co jest nowe. Kryteria akceptacji:

- Po wejściu na stronę główną wyświetla się lista kafelków uporządkowana
  malejąco według daty publikacji.
- Każdy kafelek zawiera tytuł i datę.
- Testowalne: zapytanie GET /api/acts zwraca listę z paginacją i polami
  wymaganymi.

US-002 Tytuł: Otwieranie widoku szczegółowego aktu (anonim) Opis: Jako anonimowy
użytkownik chcę otworzyć widok szczegółowy aktu, zobaczyć streszczenie i link do
oryginału. Kryteria akceptacji:

- Kliknięcie kafelka otwiera /acts/{id} z pełnym streszczeniem, sekcją wpływu i
  linkiem do PDF.
- Jeśli brak danych o głosowaniach, UI pokazuje komunikat "dane o głosowaniu
  niedostępne".

US-003 Tytuł: Limit odczytów dla anonimów Opis: Jako anonimowy użytkownik mogę
przeczytać 3 pełne streszczenia; po przekroczeniu limitu nie mogę otwierać
kolejnych i widzę komunikat z możliwością zalogowania. Kryteria akceptacji:

- System zlicza odczyty pełnych widoków szczegółowych na sesję/ip/ciasteczko.
- Testowalne: wykonać 4 zapytania GET /acts/{id} i otrzymać bład na stronie.

US-004 Tytuł: Zgłoszenie problemu (anonim) Opis: Jako anonimowy użytkownik chcę
móc zgłosić problem z danym streszczeniem (mailto/webhook), aby administratorzy
mogli to sprawdzić. Kryteria akceptacji:

- Pod każdym streszczeniem jest przycisk "Zgłoś problem" otwierający
  pre-wypełnioną wiadomość mailto lub wywołujący webhook z ID aktu i metadanymi.
- Testowalne: kliknięcie uruchamia mailto z poprawnymi polami lub generuje POST
  na webhook (symulacja).

---

### Rola: Zalogowany użytkownik (user)

US-005 Tytuł: Rejestracja i logowanie (opcjonalne) Opis: Jako użytkownik chcę
się zarejestrować i zalogować (Clerk), aby uzyskać rozszerzony dostęp do treści.
Kryteria akceptacji:

- Możliwość rejestracji/loginu przez zewnętrznego providera (SSO) lub email; po
  zalogowaniu otrzymuję token sesyjny.
- Testowalne: przeprowadzić logowanie i sprawdzić endpoint GET /me zwracający
  dane użytkownika i rolę.

US-006 Tytuł: Zwiększony dostęp dla zalogowanych Opis: Jako zalogowany
użytkownik chcę mieć zwiększony limit odczytów (w MVP: brak limitu), aby czytać
więcej streszczeń. Kryteria akceptacji:

- Po zalogowaniu limit odczytów anonimów nie jest stosowany dla tego konta.
- Testowalne: zalogowany użytkownik wykonuje > 10 zapytań GET /acts/{id} bez
  otrzymania błędu.

---

### Rola: Administrator / Superadmin

US-008 Tytuł: Przegląd kolejek ingestowych (admin) Opis: Jako admin chcę widzieć
listę nowych ingestów oraz wpisów oznaczonych jako "podejrzane", aby je
zweryfikować. Kryteria akceptacji:

- Podejrzane akty są specjalnie oznaczone na stronie głównej. Admin moze w nie
  wejść i je edytować.
- Testowalne: uytkownik z rolą admin moze zmienić treść aktu (inne dane przed i
  po edycji zwracane przez ten sam endpoint).

US-013 Tytuł: Powiadomienia o niskim confidence (admin) Opis: Jako admin chcę
otrzymywać powiadomienia (email/webhook) o wpisach z confidence < threshold, aby
szybszej weryfikacji. Kryteria akceptacji:

- System wysyła powiadomienie dla każdego rekordu spełniającego warunek; można
  konfigurować threshold.
- Testowalne: utwórz wpis z confidence 0.2 i potwierdź wysłanie powiadomienia.

---

### Rola: System / Operacje

US-014 Tytuł: Harmonogram ingestów 2× dziennie Opis: Jako operator systemu chcę,
aby pipeline ingest uruchamiał się dwa razy dziennie automatycznie. Kryteria
akceptacji:

- Cron uruchamia job o skonfigurowanych godzinach;
- Testowalne: symulacja cron run i sprawdzenie nowych rekordów/metryk.

US-015 Tytuł: Retry/backoff przy błędach ingestu Opis: Jako operator chcę, aby
pipeline retryował błędy transientne z backoffem, aby zwiększyć odporność.
Kryteria akceptacji:

- Job ponawia próbę N razy z rosnącym opóźnieniem; po wyczerpaniu retry oznacza
  rekord jako failed i generuje alert.
- Testowalne: wymuś błąd network i potwierdź retry oraz alert.

---

### Scenariusze alternatywne i skrajne (edge cases)

US-018 Tytuł: Brak linku do PDF w danytch Opis: Jako system chcę oznaczyć rekord
z brakującym url_pdf i skierować go do reprocessingu oraz admina. Kryteria
akceptacji:

- Status rekordu = missing_pdf; widoczny w kolejce admina; możliwość ręcznego
  triggera reprocess.
- Testowalne: ingest z pustym url_pdf tworzy rekord z status missing_pdf.

US-019 Tytuł: Brak danych o głosowaniu Opis: Jako system chcę oznaczyć rekord,
dla którego brak danych o głosowaniu, aby admin mógł podjąć decyzję. Kryteria
akceptacji:

- Pole missing_vote_data = true; UI pokazuje komunikat i umożliwia reprocess lub
  ręczne uzupełnienie.
- Testowalne: ingest bez danych głosowania ustawia flaga i widoczne w UI.

US-021 Tytuł: Ochrona przed nadużyciem limitu (anonim) Opis: Jako inżynier chcę
mechanizm ograniczający obejścia limitu (ciasteczka, IP, fingerprint), aby
ograniczyć nadużycia. Kryteria akceptacji:

- System używa kombinacji cookie + IP + fingerprint do identyfikacji anonimów;
  wielokrotne próby obejścia blokowane i logowane.
- Testowalne: symulacja zmiany cookie i potwierdzenie, że system wykrywa i
  blokuje obejścia.

US-023 Tytuł: Fallback LLM i retry Opis: Jako system chcę mechanizm fallbacku
gdy model LLM nie odpowiada (inny model / ponowna próba), aby pipeline był
bardziej odporny. Kryteria akceptacji:

- W przypadku błędu modelu, pipeline próbuje fallback_model lub retry; jeśli
  nadal nieudane, wpis oznaczany jako failed_llm i admin powiadamiany.
- Testowalne: symulacja błędu LLM i potwierdzenie przebiegu procedury.

---

## 6. Metryki sukcesu

Metryki techniczne i biznesowe do monitorowania w MVP:

1. Aktywność użytkowników (biznesowa):

- DAU (dzienne unikalne użytkownicy) / tygodniowi unikalni użytkownicy.
- Liczba odsłon widoków szczegółowych ustaw.
- Cel początkowy: ustalić baseline w pierwszym miesiącu; docelowe wartości
  wymagają decyzji produktowej.

2. Stabilność ingestu (operacyjna):

- Success rate ingestów (procent poprawnie przetworzonych rekordów) — cel: > 95%
  (do potwierdzenia).
- % rekordów z missing_pdf lub missing_vote_data — monitorować tygodniowo.
- Średni czas reprocessingu dla brakujących PDF (target: reprocess job w oknie
  24–48h). (Mierzalne metryki: avg_time_to_reprocess)

3. Jakość streszczeń (produktowa):

- % summary z confidence < threshold (np. 0.5) → trafiło do ręcznej weryfikacji.
  (Monitorować trend spadkowy.)
- Liczba cofkniętych/edytowanych opublikowanych summary (jako wskaźnik
  hallucination/ błędów).

4. Bezpieczeństwo i zgodność:

- Liczba incydentów nieautoryzowanego dostępu (0 jako aspiracja).
- Czas reakcji na krytyczne alerty ingestu (SLA operacyjny, do ustalenia).

5. UX / adopcja:

- Procent anonimów konwertujących do zalogowanych (np. po wyświetleniu
  informacji o limicie).
- Średni czas spędzony na stronie przy czytaniu streszczenia (engagement).

Sposób zbierania metryk:

- Instrumentacja backendu (Prometheus / inny monitoring) + dashboard (Grafana)
  do realtime metriców.
- Logi akcji adminów i użytkowników (audit_log) do analizy jakości.

---

Kontrola jakości PRD (lista kontrolna):

- Każda historyjka ma kryteria akceptacji testowalne: TAK (opisane powyżej).
- Kryteria akceptacji są konkretne i mierzalne: TAK (HTTP status, pola API,
  progi, liczby, czas).
- Historia uwzględnia uwierzytelnianie/autoryzację: TAK (US-005, US-022,
  US-012).
- Czy wystarczająca liczba historyjek, aby zbudować MVP: TAK (ingest,
  prezentacja, admin, auth, operacje, edge cases).

Nierozwiązane decyzje wymagające dalszych decyzji produktowych (dołączyć do
backlogu):

- Dokładne progi confidence (threshold) i proces SLA manualnej weryfikacji.
- Wybór konkretnego modelu LLM oraz budżet na API i fallback.
- Dokładne godziny cronów i parametry retry/backoff.
- Konkretne KPI liczbowe (DAU, retention) do celów biznesowych.
- Polityka prawna / disclaimer za streszczenia (treść i odpowiedzialność).
