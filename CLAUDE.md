# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Ricardo Sanchez (Junior Software Engineer), built with Next.js 14, TypeScript, and Tailwind CSS. The site showcases professional experience, skills, and projects with a modern dark theme and animated background effects.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (target: ES6, strict mode enabled)
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

### Project Structure
- **`app/`**: Next.js App Router pages
  - `layout.tsx`: Root layout with metadata
  - `page.tsx`: Main portfolio page (single-page application)
  - `globals.css`: Global styles and custom animations
- **`components/`**: Reusable React components
  - `ui/`: shadcn/ui component library
  - `AnimatedBackground.tsx`: Starfield background animation
  - Custom effect components (WaterDropEffect, WaterRippleEffect, RippleEffect)
- **`lib/`**: Utility functions (`utils.ts` contains `cn()` for class merging)
- **`hooks/`**: Custom React hooks
- **`public/`**: Static assets (images, placeholders)

### Path Aliases
TypeScript is configured with `@/*` alias pointing to the root directory:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### shadcn/ui Configuration
- Components use Radix UI with Tailwind styling
- Base color: neutral
- CSS variables enabled for theming
- Icon library: lucide-react
- Configuration file: `components.json`

### Styling Approach
- Dark theme with blue accent colors (`bg-gray-900`, `text-blue-300`)
- Glassmorphism effects (`backdrop-blur-sm`, `bg-black/50`)
- Custom animations: `float` (for profile image) and `ripple` (for interactive effects)
- Hover effects with scale transforms and border color transitions

### Next.js Configuration
The `next.config.mjs` has build optimizations enabled but development safeguards:
- ESLint and TypeScript errors are ignored during builds (`ignoreBuildErrors: true`)
- Image optimization is disabled (`unoptimized: true`)
- Experimental webpack build workers enabled for faster builds

## Component Patterns

### Card Components
The main page uses three reusable card component patterns:
- `SkillCard`: Displays skill categories with badge tags
- `ProjectCard`: Shows project info with hover effects and external link icon
- `ExperienceCard`: Lists work experience with role, company, and period

All cards share the base style: `bg-black/50 backdrop-blur-sm border-gray-800` with hover effects that scale and change border color.

### Page Sections
The single-page layout (`app/page.tsx`) contains these sections:
1. Header with profile image and social links
2. About Me
3. Experience
4. Skills (3-column grid)
5. Projects (3-column grid)
6. Contact Me (form UI only - no backend integration)
7. Footer

### Background Animation
`AnimatedBackground` component renders 50 randomly positioned white dots that animate with varying speeds to create a starfield effect. It's positioned with `fixed inset-0 z-0`, and content overlays with `relative z-10`.

## Important Notes

- The contact form is UI-only (no submission handler implemented)
- Profile image is hosted on Vercel blob storage
- Resume link points to Google Docs
- Social links: GitHub, LinkedIn, Email
- No routing - entire portfolio is a single page
- Build errors/warnings are suppressed in config (should be addressed for production)
