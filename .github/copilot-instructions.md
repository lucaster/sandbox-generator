# Copilot Instructions for Sandbox Generator

## Project Overview
This is a multi-framework sandbox for generating tabletop gaming elements including hex maps, dice rolls, and random tables. The main application is built with Angular (sandbox-generator-ng), with parallel implementations in Vue (sandbox-generator-vue) and plain TypeScript (sandbox-generator-ts).

## Architecture
- **Angular App**: Standalone components with signals-based state management
- **Core Logic**: Shared drawing utilities in `sandbox-generator-ng/src/drawing/hex.ts` for hex grid calculations
- **Pages**: Feature-specific routes like `/hex-draw`, `/honeycomb`, `/honeycomb-svg`
- **Data Flow**: Components use `HexOps` for geometric calculations, `SvgDrawer` for SVG rendering, and dice utilities for randomization

## Key Patterns
- Use `HexOps` class for all hex coordinate calculations (e.g., `hexOps.up(center)`, `hexOps.hexPoints(center)`)
- Render SVGs with `SvgDrawer` methods: `drawPolygon()`, `drawImageAtPoint()`, `drawTextAtPoint()`
- Follow Angular best practices: standalone components, signals, `ChangeDetectionStrategy.OnPush`
- Avoid NgModules; use `input()`/`output()` functions over decorators
- Use native control flow (`@if`, `@for`) instead of structural directives

## Developer Workflows
- **Angular**: `cd sandbox-generator-ng && ng serve` (with `--poll 2000` for file watching)
- **Vue**: `cd sandbox-generator-vue && npm run dev`
- **Build**: `ng build` in Angular project; uses Vite for Vue
- **Testing**: `ng test` for Angular (Karma), `npm run test:unit` for Vue (Vitest)
- **Component Generation**: Use `ng generate component --skip-tests` to avoid creating spec files
- **Dependencies**: Run `npm install` in each project directory; uses `honeycomb-grid` and `@svgdotjs/svg.js` for advanced grid/SVG features

## Conventions
- Component selectors: `app-{feature-name}` (e.g., `app-hex-draw`)
- File structure: `src/app/pages/{feature}/` for page components
- State: Use signals for reactive state, `computed()` for derived values
- Images: Static images via `NgOptimizedImage`; dynamic SVGs built programmatically
- Routing: Lazy-loaded feature routes in `app.routes.ts`

## Coding Conventions
- **TypeScript**: Use strict type checking, prefer type inference, avoid `any` (use `unknown` instead)
- **Angular**: Always use standalone components (default), signals for state, `ChangeDetectionStrategy.OnPush`
- **Components**: Leave an empty line at the beginning of the class body, use `input()`/`output()` functions, `computed()` for derived state, inline templates for small components, reactive forms, class/style bindings over ngClass/ngStyle, no specs generation
- **State Management**: Signals for local state, pure transformations, use `update`/`set` not `mutate`
- **Templates**: Native control flow (`@if`, `@for`, `@switch`), async pipe for observables
- **Services**: Single responsibility, `providedIn: 'root'`, use `inject()` function
- **Host Bindings**: Use `host` object in decorator instead of `@HostBinding`/`@HostListener`
- **Images**: Use `NgOptimizedImage` for static images (not base64)

## Examples
- Hex drawing: See `src/drawing/hex.ts` for `HexOps` usage and `pages/hex-draw/hex-draw.ts` for component integration
- SVG rendering: `SvgDrawer.drawPolygon(points)` for hex shapes, with options for images/text overlays
- Random tables: Use `dice.ts` for roll simulations and table lookups

## Integration Points
- External libs: `honeycomb-grid` for complex grid algorithms, `@svgdotjs/svg.js` for advanced SVG manipulation
- Cross-component: Shared utilities in `src/drawing/` and `src/dice/` directories
- Data persistence: None currently; all state is ephemeral
