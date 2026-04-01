# TrainHub - Claude Code Instructions

## Project Overview
TrainHub is a personal training platform (Next.js 14 + Supabase + Stripe) for fitness trainers to manage clients, routines, nutrition, messaging, and payments. Live at train-hub-five.vercel.app.

## Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components)
- **Database**: Supabase (PostgreSQL + Auth + RLS + Storage + Realtime)
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **State**: TanStack React Query + Zustand stores
- **i18n**: next-intl (ES/EN, Spanish is primary)
- **Validation**: Zod schemas
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Email**: Gmail SMTP (nodemailer) for invitations, Supabase SMTP for auth
- **Testing**: Vitest + React Testing Library + Playwright (E2E)

## Architecture Patterns

### File Organization
- `src/services/*.service.ts` — Supabase queries, business logic
- `src/hooks/use-*.ts` — TanStack Query wrappers with mutations + toasts
- `src/lib/validations/*.ts` — Zod schemas + exported types
- `src/stores/*.ts` — Zustand stores (routine-builder, rest-timer, ui)
- `src/components/{feature}/*.tsx` — Feature-specific components
- `src/app/[locale]/(trainer)/*` — Trainer pages (behind auth)
- `src/app/[locale]/(client)/*` — Client pages (behind auth)
- `src/app/api/*` — API routes (admin operations, webhooks)
- `supabase/migrations/*.sql` — Database migrations (numbered 00001+)
- `messages/{es,en}.json` — Translation files

### Service Pattern
All services follow this pattern:
```typescript
const supabase = createClient(); // browser client
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error("Not authenticated");
// ... queries with RLS
```
For admin operations (bypassing RLS): `createAdminClient()` from `@/lib/supabase/admin`

### Hook Pattern
```typescript
export function useFeature() {
  return useQuery({
    queryKey: ["feature-key"],
    queryFn: () => service.getFeature(),
    staleTime: 60 * 1000,
  });
}
export function useCreateFeature() {
  const qc = useQueryClient();
  const t = useTranslations("feature");
  return useMutation({
    mutationFn: (data) => service.createFeature(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["feature-key"] }); toast.success(t("created")); },
    onError: () => { toast.error(t("createError")); },
  });
}
```

### Database Conventions
- All tables have RLS enabled
- Trainer tables: `USING (auth.uid() = trainer_id)`
- Client tables: `USING (EXISTS (SELECT 1 FROM clients WHERE clients.user_id = auth.uid()))`
- `handle_updated_at()` trigger on tables with `updated_at`
- CASCADE deletes on foreign keys
- UUID primary keys with `gen_random_uuid()`

## Key Business Rules

### Roles
- **Trainer**: Creates clients, routines, nutrition plans, manages everything
- **Client**: Views assigned content, logs workouts, sends messages
- **Admin**: Access to admin panel (role in users table)

### Client Onboarding
Two flows:
1. **Trainer creates profile first**: Name + email → generates invite link → client only sets password
2. **Generic link**: Trainer generates open invite → client fills everything → profile auto-created

### Subscription Tiers
- Free: 3 clients | Pro: 25 clients | Elite: unlimited
- Trainer wellnessrealoficial@gmail.com has elite (set in subscriptions table)

### Feature Gating (Service Tiers)
- Básico: training + messaging (no nutrition)
- Pro: everything including nutrition + checkins
- `isFeatureEnabled(features, key)` returns true when no tier assigned (backward compat)

### Exercise Groups
Exercises in routines can be grouped: solo, superset (biserie), triset, circuit, EMOM, AMRAP. Each group has its own `exercise_groups` row with type, rounds, time_limit, rest_between_rounds.

## Development Rules

### Spanish Language (RAE)
- All user-facing text in Spanish uses proper RAE accents: á, é, í, ó, ú, ñ, ¿, ¡
- Translation keys in `messages/es.json` must follow RAE rules
- "Biserie" not "Superserie"

### Mobile First
- All pages MUST work on mobile (320px+)
- Use `overflow-x-hidden` on containers
- Reduce padding on mobile: `p-3 sm:p-6`
- Tabs: horizontal scroll, not wrap
- Buttons: `size="sm"` on mobile, hide text with `hidden sm:inline`

### Never
- Never use `git push --force`
- Never skip hooks (`--no-verify`)
- Never commit .env files or credentials
- Never add features beyond what was asked
- Never delete user data without confirmation dialog

### Always
- Build check (`npx next build`) before committing
- Run tests when creating new modules
- Add translations to BOTH es.json and en.json
- Use `toast.success/error` for user feedback on mutations
- Use `ConfirmDialog` before destructive actions
- Include `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>` in commits

### Commit Messages
Format: `type: short description`
Types: feat, fix, test, refactor, docs
Body: bullet points explaining what changed and why

## Accounts & Config
- Trainer: wellnessrealoficial@gmail.com (UUID: 3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f)
- Gmail SMTP: trainhubapp86@gmail.com (GMAIL_USER + GMAIL_APP_PASSWORD in Vercel)
- Supabase SMTP: Gmail app password "supabase" in Supabase dashboard
- USDA API: configured in Vercel (USDA_API_KEY)
- Resend: configured but limited (no verified domain) — invites use Gmail SMTP instead

## Current Module Count
- 39 test suites, 383+ tests
- 1140+ exercises (873 from free-exercise-db + custom)
- Clients, routines, nutrition, messaging, calendar, analytics, questionnaires, service tiers, coaching plans, payments, fasting, menstrual tracking, notifications
