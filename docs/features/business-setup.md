# Business Setup

## Status

Initial owner setup wizard is in progress.

Implemented steps:

- business basics,
- location,
- team,
- workstations,
- services.

Current wizard order:

- business basics,
- location,
- team only for `TEAM`,
- workstations only for `TEAM`,
- services,
- add-ons,
- team services only for `TEAM`,
- availability,
- booking rules,
- public profile,
- summary.

For `SOLO`, team-specific steps are not rendered and are not counted in wizard
progress. Saving location moves solo businesses to services and team businesses
to the team step.

## Backend

Module:

- `apps/backend/src/modules/businessSetup`

Routes:

- `GET /business/setup`
- `PATCH /business/setup/business-basics`
- `PATCH /business/setup/location`
- `PATCH /business/setup/team`
- `PATCH /business/setup/workstations`
- `PATCH /business/setup/services`
- `GET /business/team`
- `POST /business/team/members/:teamMemberId/invitations`
- `POST /business/team/invitations/:invitationId/cancel`
- `GET /team-invitations/:token`
- `POST /team-invitations/:token/accept`

All routes require an authenticated user with salon-management permissions.

## Data

Business setup state is stored on `Business`:

- `onboardingStatus`,
- `onboardingCurrentStep`,
- `onboardingCompletedSteps`,
- `onboardingCompletedAt`.

Business basics and location are stored on `Business`. Location uses the shared
Polish address contract: city accepts letters, Polish characters, spaces and
hyphen, starts with an uppercase letter and is 2-50 characters; postal code
uses `NN-NNN`; street accepts letters, Polish characters, digits, spaces, hyphen
and dot and is 2-60 characters; building number accepts digits plus optional
single letter; apartment number is optional digits only; arrival and parking
notes are optional text up to 500 characters without links, HTML or emoji.

Workstations are stored in `BusinessWorkstation` and belong to one business.

Team members are stored in `BusinessTeamMember` and belong to one business.
They are business-owned profiles, not necessarily user accounts. `email` is
optional and unique per business when present; blank e-mails are allowed for
multiple members. `userId` is nullable and reserved for a later invite/accept
flow. Public registration should not automatically grant management access only
because a registered e-mail matches a team profile.

Panel access invitations are stored in `BusinessTeamInvitation`. The database
stores only `tokenHash`; the plaintext token is returned once from the temporary
test endpoint and can later be sent by a real e-mail adapter. Creating a new
invitation cancels any previous active invitation for the same team member.
Accepting an invitation requires an authenticated user in the same business with
the same e-mail as the invitation, then links `BusinessTeamMember.userId`,
creates or updates `BusinessMembership`, and updates `User.role` to the invited
role.

Services are stored in `BusinessService` and belong to one business. Prices are
stored as integer minor units in `priceAmount`. Service setup validates names as
2-60 characters using letters, Polish characters, digits, spaces and hyphen;
duration as 1-600 minutes; price as 0-9999.99 with comma or dot decimals; and
description as optional text up to 500 characters.

## Frontend

Wizard route:

- `/management/setup`

Feature files:

- `apps/webapp/src/features/businessSetup`

Forms use shared schemas from `packages/shared/src/businessSetup`.

The team step renders the owner as a read-only row from the active session/setup
basics, lets the owner add team members with role (`Manager`, `Employee` or
`Intern`) and service-provider status, and persists those members through
`PATCH /business/setup/team`. Backend validation rejects duplicate member
e-mails inside the same business and rejects adding the owner e-mail as a
separate member.

The employees page contains a temporary testing section for panel invitations.
It lists saved team members, shows access status (`NO_ACCESS`, `INVITED`,
`ACTIVE`), generates a test invite URL, previews the token and can cancel or
attempt to accept the invitation as the currently signed-in account. Real e-mail
delivery is intentionally not implemented yet.

## Next Steps

- add-ons,
- team services,
- availability,
- booking rules,
- public profile,
- summary and completion.

Tworzymy **initial business setup wizard** dla aplikacji do rezerwacji usług beauty. Aplikacja ma obsługiwać różne biznesy beauty, np. paznokcie, rzęsy, brwi, makijaż itd. Na MVP jeden biznes ma jedną główną specjalizację.

Owner zakłada konto, otrzymuje rolę właściciela/administratora swojego biznesu i przy pierwszym zalogowaniu musi przejść początkową konfigurację biznesu.

## Główne założenie

Onboarding nie jest jednorazowym formularzem ani modalem. Powinien być osobnym pełnoekranowym wizardem, np.:

`/management/setup`

Konfiguracja jest zapisywana na backendzie krok po kroku.

Nie należy wykrywać potrzeby onboardingu wyłącznie przez `localStorage` lub frontendowe `isFirstLogin`.

Backend powinien być źródłem prawdy i zwracać status konfiguracji biznesu:

- `NOT_STARTED`
- `IN_PROGRESS`
- `COMPLETED`

Opcjonalnie zapisujemy także:

- `currentStep`
- `completedSteps`
- `onboardingCompletedAt`

Przykładowy model:

```ts
type BusinessOnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type BusinessSetupState = {
  status: BusinessOnboardingStatus;
  currentStep: string | null;
  completedSteps: string[];
  onboardingCompletedAt: string | null;
};
```

Po zalogowaniu aplikacja pobiera aktualny status konfiguracji biznesu.

### Zachowanie aplikacji

#### `NOT_STARTED`

Owner zostaje automatycznie przekierowany do:

```text
/management/setup
```

To jest pierwsze uruchomienie konfiguracji.

#### `IN_PROGRESS`

Owner może kontynuować onboarding od ostatniego nieukończonego kroku.

Powinien również móc użyć opcji:

```text
Dokończę później
```

i wejść do panelu.

Na dashboardzie pokazujemy wtedy wyraźną kartę:

```text
Dokończ konfigurację biznesu

Konfiguracja ukończona w 45%

✓ Informacje o biznesie
✓ Lokalizacja
○ Usługi
○ Zespół
○ Dostępność
○ Zasady rezerwacji

[ Kontynuuj konfigurację ]
```

Nie blokujemy całego panelu.

Blokujemy jedynie funkcjonalności, które nie mogą działać bez brakujących danych, np. kalendarz/rezerwacje bez usług i dostępności.

#### `COMPLETED`

Owner przechodzi normalnie do panelu zarządzania.

---

# Wizard powinien być dynamiczny

Nie każdy biznes przechodzi przez dokładnie te same kroki.

Jedną z pierwszych decyzji jest:

```text
Jak prowadzisz swój biznes?

○ Pracuję samodzielnie
○ Mam zespół
```

Rozróżniamy:

```ts
businessType: "SOLO" | "TEAM";
```

### SOLO

Owner automatycznie jest również osobą świadczącą usługi.

Nie pytamy później o dodanie samego siebie jako pracownika.

Nie pokazujemy osobnego kroku konfiguracji zespołu.

Nie pokazujemy kroku konfiguracji stanowisk na początku.

### TEAM

Po wyborze zespołu pytamy:

```text
Czy Ty również wykonujesz usługi?

○ Tak, również przyjmuję klientki
○ Nie, tylko zarządzam biznesem
```

Czyli rola użytkownika i wykonywanie usług są od siebie niezależne.

Owner może:

```text
role = OWNER
providesServices = true
```

albo:

```text
role = OWNER
providesServices = false
```

Tak samo później manager może wykonywać usługi albo wyłącznie zarządzać biznesem.

---

# Planowane kroki wizarda

Wizard docelowo będzie posiadał mniej więcej następujące kroki.

## 1. Twój biznes

Podstawowe informacje i struktura działalności.

## 2. Sposób świadczenia usług / lokalizacja

Biznes może świadczyć usługi:

- w salonie,
- z dojazdem do klienta,
- w obu wariantach.

Architektura nie może blokować późniejszej obsługi usług mobilnych.

## 3. Stanowiska — tylko TEAM

Ten krok istnieje wyłącznie dla działalności zespołowej.

Owner może określić zasoby/stanowiska, np.:

```text
Stanowisko manicure × 2
Fotel pedicure × 1
Gabinet kosmetyczny × 1
```

Stanowiska będą później uwzględniane przy obliczaniu dostępności.

Przykład:

```text
Magda jest wolna o 10:00
Kasia jest wolna o 10:00

ale:

stanowisko manicure = tylko 1

→ tylko jedna rezerwacja może odbyć się o 10:00
```

Na MVP jednoosobowa działalność nie przechodzi tego kroku.

## 4. Usługi

Owner dodaje usługi.

Podstawowe wartości:

- nazwa,
- domyślna cena,
- domyślny czas trwania,
- możliwość rezerwacji online,
- salon/dojazd,
- opcjonalny buffer przed/po usłudze,
- opcjonalne wymagane stanowisko.

Na MVP jeden biznes posiada jedną główną kategorię usług.

## 5. Addony — opcjonalnie

Owner może zdefiniować dodatkowe opcje do konkretnej usługi.

Np.:

```text
Manicure hybrydowy
90 min
140 zł

French
+15 min
+20 zł

Ściągnięcie stylizacji
+20 min
+25 zł
```

Każdy addon ma:

- domyślny dodatkowy czas,
- domyślną dodatkową cenę.

Addony można pominąć podczas inicjalizacji.

## 6. Zespół — tylko TEAM

Dodawanie osób do biznesu.

Każda osoba ma niezależnie:

```text
role
providesServices
```

Przykłady:

```text
Magda
OWNER
providesServices = true

Kasia
MANAGER
providesServices = false

Natalia
MANAGER
providesServices = true

Ola
EMPLOYEE
providesServices = true

Basia
INTERN
providesServices = true
```

Pracownik nie musi od razu posiadać konta użytkownika.

Owner może stworzyć profil pracownika, a możliwość zaproszenia go do panelu może zostać dodana później.

## 7. Usługi zespołu — tylko TEAM

Owner określa, kto wykonuje konkretne usługi.

Przykład:

```text
                      Magda   Natalia   Ola

Manicure klasyczny      ✓        ✓       ✓
Manicure hybrydowy      ✓        ✓       ✓
Pedicure                ✓        ✓       ✕
```

Usługa posiada domyślne:

- `duration`
- `price`

ale każdy pracownik może posiadać override:

```text
Manicure hybrydowy

default:
90 min
140 zł

Magda:
75 min
150 zł

Natalia:
105 min
130 zł
```

Analogicznie addony mogą posiadać wartości indywidualne dla pracownika:

```text
French

default:
+15 min
+20 zł

Magda:
+10 min
+25 zł
```

Jeżeli override nie istnieje, wykorzystywana jest wartość domyślna.

## 8. Godziny i dostępność

Konfiguracja:

- godzin biznesu,
- godzin osób świadczących usługi,
- regularnych przerw.

Owner może najpierw ustawić godziny biznesu i skopiować je do pracowników.

Przykład:

```text
Salon:
Pon–Pt 08:00–18:00

Magda:
Pon–Pt 08:00–16:00

Natalia:
Pon–Pt 12:00–18:00
```

Dni specjalne, urlopy, ręczne blokady i dodatkowe terminy mogą być później konfigurowane z poziomu kalendarza.

## 9. Zasady rezerwacji

Podstawowe ustawienia:

- domyślny interwał startów, np. 15/30/60 min,
- minimalne wyprzedzenie rezerwacji,
- maksymalny okres rezerwacji w przyszłość,
- opcjonalny limit liczby wizyt dziennie,
- zasady anulowania,
- automatyczne/ręczne potwierdzanie,
- dla TEAM: możliwość wyboru konkretnego pracownika i/lub `Dowolna osoba`.

## 10. Podstawowe dane strony

Opcjonalna konfiguracja:

- logo,
- telefon,
- e-mail,
- opis,
- social media.

Nie powinna blokować uruchomienia systemu.

## 11. Podsumowanie

Pokazujemy checklistę skonfigurowanych elementów.

Przykład:

```text
✓ Informacje o biznesie
✓ Lokalizacja
✓ 6 usług
✓ 3 pracowników
✓ Usługi przypisane pracownikom
✓ Grafiki
✓ Stanowiska
✓ Zasady rezerwacji

[ Uruchom rezerwacje ]
```

Po ukończeniu ustawiamy:

```text
status = COMPLETED
onboardingCompletedAt = current timestamp
```

---

# Co jest wymagane do uruchomienia rezerwacji

Nie każdy element wizarda musi być wymagany.

Minimalna poprawna konfiguracja biznesu powinna posiadać:

- nazwę biznesu,
- `businessType`,
- informację czy owner świadczy usługi,
- sposób wykonywania usług,
- minimum jedną usługę,
- cenę usługi,
- czas trwania usługi,
- minimum jedną osobę zdolną ją wykonać,
- dostępność tej osoby,
- poprawną konfigurację wymaganego stanowiska, jeżeli usługa go wymaga.

Logo, opis, social media, addony itd. są opcjonalne.

---

# Implementujemy teraz podstawę wizarda

Na początku nie implementuj wszystkich kroków.

Najpierw przygotuj:

1. routing dla wizarda,
2. wspólny layout,
3. progress indicator,
4. mechanizm `next/back`,
5. zapisywanie aktualnego kroku,
6. obsługę statusów `NOT_STARTED / IN_PROGRESS / COMPLETED`,
7. redirect po zalogowaniu,
8. pierwszy krok `Twój biznes`.

Architektura komponentów powinna pozwolić później dodawać kolejne kroki bez przebudowy całego wizarda.

---

# Pierwszy krok: „Twój biznes”

Na pierwszym ekranie chcemy zebrać:

### Nazwa biznesu

```text
Jak nazywa się Twój biznes?

[ Maison Rouge ]
```

### Główna specjalizacja

Na MVP wybieramy jedną:

```text
○ Paznokcie
○ Rzęsy
○ Brwi
○ Makijaż
○ Kosmetologia
○ Inne
```

### Typ biznesu

```text
Jak prowadzisz swój biznes?

[ Pracuję samodzielnie ]

Tylko ja wykonuję usługi.

[ Mam zespół ]

Usługi wykonuje kilka osób.
```

Jeżeli użytkownik wybierze `SOLO`:

```text
owner.providesServices = true
```

ustawiamy automatycznie.

Jeżeli wybierze `TEAM`, pokazujemy dodatkowo:

```text
Czy Ty również wykonujesz usługi?

○ Tak, również przyjmuję klientki
○ Nie, tylko zarządzam biznesem
```

Wartości pierwszego kroku mogą wyglądać następująco:

```ts
type BusinessBasicsForm = {
  name: string;
  specialization:
    | "NAILS"
    | "BROWS_AND_LASHES"
    | "MAKEUP";

  businessType: "SOLO" | "TEAM";

  ownerProvidesServices: boolean;
};
```

Dla `SOLO`:

```ts
ownerProvidesServices = true;
```

i pole nie jest wyświetlane.

Dla `TEAM` użytkownik musi sam dokonać wyboru.

Po poprawnym zapisaniu pierwszego kroku:

```text
NOT_STARTED
→ IN_PROGRESS
```

oraz:

```text
currentStep = "LOCATION"
completedSteps = ["BUSINESS_BASICS"]
```

Dane zapisujemy od razu na backendzie.

Refresh strony nie może powodować utraty postępu.

---

## Ważne zasady implementacyjne

- Wizard nie może trzymać całego postępu wyłącznie w stanie Reacta.
- Backend jest źródłem prawdy.
- Każdy zakończony krok zapisujemy.
- Użytkownik może wrócić do wcześniejszego kroku i go edytować.
- Edycja danych onboardingowych później odbywa się na tych samych danych co normalne ustawienia biznesu.
- Nie tworzymy osobnego „modelu danych tylko dla onboardingu”.
- Wizard jest wyłącznie innym UI do początkowej konfiguracji istniejących encji biznesowych.
- Krok `Stanowiska` występuje tylko dla `businessType = TEAM`.
- Kroki `Zespół` i `Usługi zespołu` występują tylko dla `TEAM`.
- Jeżeli zmiana wcześniejszej odpowiedzi wpływa na kolejne kroki, wizard musi odpowiednio przeliczyć listę wymaganych kroków.
