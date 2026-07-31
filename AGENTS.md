# RoDevsy Web App — Project Context

**Stack:** SvelteKit 5 (runes mode), ShadCN-Svelte components (`$lib/components/ui/`), Tailwind CSS v4, `@lucide/svelte` icons, axios API client, svelte-sonner toasts. Static adapter (`adapter-static`, prerendered, output → `build/`).

## App structure

- `src/routes/(app)/` — public pages: `projects`, `privacy`, `terms`, `docs`; placeholder pages: `forum`, `marketplace`, `talent`.
- `src/routes/(app)/(protected)/` — `+layout.svelte` requires auth: `dashboard`, `profile`, `settings`, `contracts`, `disputes`.
- `$lib/services/` — `auth.service.ts` (login/signup/refresh/logout), `users.service.ts` (profile + skills API).
- `$lib/state/user.svelte.ts` — user session store (`userState.profile`, `setUser`/`updateUser`/`clearUser`); header shows live `balance` from it.
- `$lib/types/auth.type.ts` — type mirror of backend enums/DTOs (see below).
- `$lib/components/shared/` — `header.svelte`, `footer.svelte`, `signup-form.svelte`, `login-form.svelte`.

## Type mirroring (keep in sync with backend!)

`$lib/types/auth.type.ts` must match backend `src/core/user/user.enum.ts` and `src/features/auth/dtos/*` **exactly**:
- `UserType`: `'Developer' | 'Client'` · `UserGender`: `'male' | 'female' | 'others'`
- `SkillSubCategory` ×19 (e.g. `'Gameplay Scripter'`, `'Systems/Backend'`, `'3D Modeler'`) · `SkillTier` ×6 (`'1.Tier V'` … `'6.Champion'`)
- Payloads: `SignupPayload` = displayName, firstName, lastName, username, email, password, `dateOfBirth` (NOT `dob`), type, gender. `LoginPayload` = username, password.
- `UserProfile` = `DeveloperProfile | ClientProfile` union discriminated by `type`.

## Auth flow

- `auth.service.initializeApp()` refreshes the token on boot, then `getProfile()` → `setUser`.
- Access token sent as `Authorization: Bearer`; refresh via cookie endpoint.
- Signup form maps NestJS validation messages to field errors by keyword (`display`, `firstname`, `username`, `dob`/`birth`, `type`, `gender`, …).

## Lint/type rules (strict)

- **Non-null assertions (`!`) are banned**; `svelte/no-navigation-without-resolve` requires `resolve()` for internal links — external URLs use a button + `window.open` (inline eslint-disable does NOT suppress this rule).
- `svelte/no-useless-mustaches`: no `{cond ? '' : 's'}` tricks or `{' '}` string mustaches — write full ternary phrases.
- Prettier: single quotes, no semicolons — run `npx prettier --write` on touched files.

## pnpm 11 quirk

Build approvals live in `pnpm-workspace.yaml` (`onlyBuiltDependencies: [esbuild]` + `allowBuilds: { esbuild: true }`) — pnpm 11 ignores `pnpm.onlyBuiltDependencies` in `package.json`.

## Verification

- `pnpm check` (svelte-check) — target 0 errors; known pre-existing warnings in `ui/toggle-group.svelte`.
- `pnpm build` — full prerender must pass (stale links to missing routes break it).
- `pnpm eslint` on changed files · `npx prettier --check` on changed files.
- Baseline: 0 check errors, production build green.

## Secrets

- No `.env` files are committed; the API base URL config lives in `$lib/api/axios.ts`.
