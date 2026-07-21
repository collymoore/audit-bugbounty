# CDS Storybook Intelligence Report
**Target**: cds-storybook.coinbase.com  
**Date**: July 15, 2026  
**Classification**: OSINT / Bug Bounty Reconnaissance

---

## 1. INFRASTRUCTURE

| Property | Value |
|----------|-------|
| **Hosting** | Amazon S3 + CloudFront (static site) |
| **CDN** | Cloudflare (edge proxy) + CloudFront (origin shield) |
| **CloudFront POP** | IAD89-P3 (Ashburn, VA - AWS US East) |
| **Origin Server** | CloudFront → S3 (`x-amz-server-side-encryption: AES256`) |
| **S3 Encryption** | AES256 server-side |
| **Last Modified** | Mon, 15 Jun 2026 21:43:21 GMT |
| **Build Type** | Production (`CONFIG_TYPE = "PRODUCTION"`) |
| **Storybook Version** | v8 (Storybook 8.x with `@storybook/react-vite` framework) |
| **Builder** | `@storybook/builder-vite` |
| **Renderer** | React |
| **Module System** | ES Modules (import maps via Vite) |

### HTTP Security Headers
- `strict-transport-security: max-age=31536000; includeSubDomains; preload`
- `x-content-type-options: nosniff`
- `set-cookie: cb_dm=...; HttpOnly; Secure; Domain=coinbase.com`
- `set-cookie: __cf_bm=...; HttpOnly; SameSite=None; Secure`

---

## 2. MONOREPO STRUCTURE (LEAKED)

The `window.STORIES` config reveals the internal monorepo layout:

```javascript
window.STORIES = [{
  "titlePrefix": "",
  "directory": "../../packages/web",
  "files": "**/*.stories.@(tsx|mdx)",
  "importPathMatcher": "^(?:\\.\\.\\/\\.\\.\\/packages\\/web(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(tsx|mdx))$"
}];
```

**Key insight**: Storybook lives in a monorepo where the CDS source is at `../../packages/web` relative to the Storybook config. This means there are likely sibling packages alongside `web/` (e.g., `packages/react-native/`, `packages/icons/`, `packages/illustrations/`, etc.).

### Source Directory Structure (from import paths)
```
packages/web/src/
├── AccessibilityAnnouncer/
├── accordion/
├── alpha/                    (experimental/in-development components)
│   ├── combobox/
│   ├── data-card/
│   ├── select-chip/
│   ├── select/
│   └── tabbed-chips/
├── animation/
├── banner/
├── buttons/
├── cards/
│   ├── ContentCard/
├── carousel/
├── cells/
├── chips/
├── coachmark/
├── collapsible/
├── controls/
├── dates/
├── dots/
├── dropdown/
├── hooks/
├── icons/
├── illustrations/
├── layout/
├── loaders/
├── media/
├── motion/
├── multi-content-module/
├── navigation/
├── numbers/
├── overlays/
│   └── tray/
├── page/
├── pagination/
├── section-header/
├── stepper/
├── system/
├── tables/
├── tabs/
├── tag/
├── tour/
├── typography/
└── visualizations/
    ├── chart/
    │   ├── area/
    │   ├── axis/
    │   ├── bar/
    │   ├── legend/
    │   ├── line/
    │   └── scrubber/
    └── sparkline/
        ├── sparkline-interactive/
        └── sparkline-interactive-header/
```

---

## 3. ALL COMPONENTS / STORIES EXPOSED (149 Title Groups, 821 Stories)

### Design Tokens & Foundations
- **Colors** — Full color palette (1 story)
- **Icons** — Icon library (1 story)
- **Illustrations** — HeroSquare, Pictogram, SpotIcon, SpotRectangle, SpotSquare, Themed (6 stories)
- **LogoMark** — Coinbase logo (1 story)

### ACCESIBILITY (1 component, 1 story)
- **Accessibility/AccessibilityViolations** — Default

### COMPONENTS (114 title groups, ~770 stories)

#### Alpha (Experimental Components)
- Alpha/Combobox (~44 stories)
- Alpha/DataCard (5 stories)
- Alpha/Select/MultiSelect (~20 stories)
- Alpha/Select/SingleSelect (~50 stories)
- Alpha/SelectChip (~18 stories)
- alpha/TabbedChips (1 story)

#### Layout
- Box (~30 stories)
- Box/Performance (1 story)
- Divider
- Fallback
- Grid
- Responsive Props

#### Navigation
- NavLink, NavigationBar, NavigationTitle, NavigationTitleSelect, Sidebar

#### Overlays
- Alert, FocusTrap, FullscreenAlert, FullscreenModal, FullscreenModalLayout, Modal
- OverlayContentContext, PopoverPanel, PortalProvider, SearchInputMenu, Toast, Tooltip, TooltipContent, Tray

#### Cards
- ContainedAssetCard, ContentCard, FloatingAssetCard, MediaCard, MessagingCard, NudgeCard, UpsellCard

#### Inputs / Controls
- Checkbox, CheckboxCell, ControlGroup, HelperText, InputIcon, InputIconButton, InputLabel
- InputStack, NativeInput, RadioCell, RadioGroup, SearchInput, SegmentedControl
- Select, SelectOption, Switch, TextInput, TextInputPerformance

#### Buttons
- AvatarButton, Button, ButtonGroup, IconButton, IconCounterButton, TileButton

#### Data Display
- Accordion, Avatar, Banner, Carousel, Cells (ContentCell, ListCell + fallbacks)
- Chips (Chip, InputChip, MediaChip, SelectChip, TabbedChips)
- Coachmark, Collapsible, Dates (A11yTest, Calendar, DateInput, DatePicker)
- Dots (DotCount, DotStatusColor, DotSymbol), Dropdown, Link
- Loaders (CircularProgress, MaterialSpinner, Spinner)
- Lottie, LottieStatusAnimation, Motion (AnimatedCaret, HintMotion, Tokens)
- MultiContentModule, PageFooter, PageHeader, Pagination
- ProgressBar, ProgressCircle, RollingNumber, SectionHeader
- SparklineInteractive, SparklineInteractiveHeader
- Stepper (Horizontal, Vertical), Table (Table, Caption, Cell, CellFallback, Row, Section)
- Tabs (Segmented Tabs, TabIndicator, TabLabel, TabNavigation, Tabs)
- Tag, Text, ThemeProvider, Tour

#### System
- ComponentConfigProvider, Interactable, Patterns, Pressable, ThemeProvider

#### Chart Visualizations
- AreaChart, Axis, BarChart, CartesianChart, ChartText, ChartTransitions
- Legend, LineChart, PercentageBarChart, PeriodSelector, ReferenceLine, Scrubber

### HOOKS
- useBreakpoints, useMediaQuery

### EXAMPLES
- Layouts

---

## 4. INTERNAL ENDPOINTS & URLs

### External URLs Found in Bundle
| URL | Context |
|-----|---------|
| `https://cds.coinbase.com` | Official CDS documentation site |
| `https://cds.coinbase.com/components/layout/Accordion/` | Component docs |
| `https://cds.coinbase.com/getting-started/theming` | ThemeProvider doc reference |

### API Endpoint References (Storybook doc links only)
- `/api/arg-types` — Reference to argTypes API
- `/api/portable-stories/portable-stories-playwright` — Playwright integration

### Library/Framework URLs (not endpoints)
Various references to: github.com/storybookjs, react.dev, motion.dev, testing-library.com, vitest.dev, etc.

**No internal API endpoints (coinbase.internal, api.coinbase.com, staging.coinbase.com, etc.) were found in the JS bundles.**

---

## 5. CREDENTIALS / SECRETS / API KEYS

**None found.** Thorough search of the 1.66 MB iframe bundle and all manager bundles revealed:
- No hardcoded API keys
- No tokens or secrets
- No `process.env.*`, `import.meta.env.*`, or environment variable references
- No AWS credentials, Stripe keys, or other service tokens
- No internal auth tokens or bearer tokens

The Storybook is a **clean production build** with no leaked credentials.

---

## 6. TAG SYSTEM & HIDDEN FEATURES

The Storybook has a tag-based visibility system configured in `window.TAGS_OPTIONS`:

```javascript
window['TAGS_OPTIONS'] = {
  "dev-only": { "excludeFromDocsStories": true },
  "docs-only": { "excludeFromSidebar": true },
  "test-only": { "excludeFromSidebar": true, "excludeFromDocsStories": true }
};
```

**All 821 entries in the index have tags `["dev", "test"]`** — no stories were found tagged with `"docs-only"`, `"test-only"`, or `"dev-only"`. The tagging infrastructure exists but no stories currently use the hidden variants.

**No internal-only component variants discovered.** All components exposed appear intended for public consumption.

---

## 7. ADDONS INSTALLED

| Addon | Bundle Path |
|-------|-------------|
| **@storybook/core-server-presets** (core) | `./sb-addons/storybook-core-server-presets-0/common-manager-bundle.js` |
| **storybook-dark-mode** (ESM) | `./sb-addons/storybook-community-storybook-dark-mode-esm-manager-1/index-bundle.js` |
| **storybook-dark-mode** (CJS) | `./sb-addons/storybook-community-storybook-dark-mode-cjs-manager-2/index-bundle.js` |
| **@storybook/addon-docs** | `./sb-addons/docs-3/manager-bundle.js` |
| **@storybook/addon-a11y** | `./sb-addons/a11y-4/manager-bundle.js` |
| **@storybook/addon-vitest** | `./sb-addons/vitest-5/manager-bundle.js` |
| **@storybook/manager (core)** | `./sb-addons/storybook-6/manager-bundle.js` |

Additional detected features:
- `Controls` (argType controls)
- `Actions` (action logger)
- `Interactions` (interaction testing)
- `Viewport` (responsive preview)
- `Backgrounds` (background switcher)
- `Outline` (CSS outline tool)
- `Measure` (measure tool)
- `Highlight` (element highlight)

---

## 8. JAVASCRIPT BUNDLE ANALYSIS

### Main Page Bundle (`/`)
- `./sb-manager/runtime.js` (443 KB)
- `./sb-manager/globals-runtime.js`

### IFrame Preview Bundle (story content)
- `./assets/iframe-BrE3--MH.js` (1.66 MB)

### Story Index
- `./index.json` (282 KB) — Complete story index with all 821 entries

---

## 9. DEPLOYMENT PIPELINE CLUES

- **Last build**: Mon, 15 Jun 2026 (about 1 month old)
- **Deployment infrastructure**: S3 bucket → CloudFront → Cloudflare DNS
- **Asset cache policy**: `public, max-age=7200` (2 hours) for JS, `no-store` for HTML
- **S3 server-side encryption**: AES256 enabled
- **Branch/Tag inference**: No version or commit hash found in URLs, but the `BrE3--MH` hash in the iframe bundle name suggests content-based hashing
- **No source maps detected**: The JS bundles are minified without attached `.map` files

---

## 10. ATTACK SURFACE OBSERVATIONS

1. **No credentials leaked** — Clean build
2. **No internal endpoints exposed** — Only public-facing CDS docs URLs
3. **Tag system infrastructure exists** but unused for hidden content — the `TAGS_OPTIONS` config enables hiding stories from sidebar/docs, but no stories currently use these tags
4. **The `alpha/` directory** contains experimental/in-progress components (Combobox, DataCard, SelectChip, etc.) which could be interesting targets as they may undergo rapid changes
5. **Monorepo path disclosure**: `../../packages/web` reveals the repo structure — there are likely other packages (like `packages/react-native`, `packages/icons`, etc.) at the same level
6. **S3 + CloudFront with SSE-AES**: Standard, well-configured deployment
7. **Old builds are not purged**: The `no-store` cache on HTML prevents stale content, but old JS chunks with different hashes may remain in S3
8. **Cookie leakage**: `Domain=coinbase.com` cookies are set from the subdomain — this could expose the session to other coinbase.com subdomains

---

## 11. PACKAGE DEPENDENCIES VISIBLE IN BUNDLE

Key dependencies identified from the bundle:
- **React** (with hooks)
- **framer-motion** v10.18.0 (animation library)
- **@storybook/react-vite** (framework)
- **@storybook/addon-a11y**, **@storybook/addon-docs**, **@storybook/addon-vitest**
- **@testing-library/react** + **@testing-library/user-event**
- **@storybook/test**
- **Polished** (styled-components helpers)
- **Chai** (assertions - test infra)

---

## 12. RECOMMENDATIONS

1. **Check periodically** for newly added stories that might leak internal details
2. **Monitor for source map exposure** — if `.map` files become accessible, full source code could be reconstructed
3. **The `alpha/` components** may be worthwhile to monitor for future internal disclosure
4. **Check if `stories.json` exists** (older Storybook format) — not found here, but `index.json` (v5 format) was found
5. **Domain cookie scope**: The `Domain=coinbase.com` cookie from a Storybook subdomain is a minor concern

---

*Report generated by autonomous OSINT recon. All findings are from publicly accessible content.*
