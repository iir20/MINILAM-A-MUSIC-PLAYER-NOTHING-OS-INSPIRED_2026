# Project Instructions

## Project Context
MiniLam OS is a minimalist, high-fidelity music player application with a strong emphasis on visual aesthetics (Nothing OS, Industrial, Cyberpunk). It features advanced audio visualization and atmospheric environment effects.

## Visualizer Logic
The application supports multiple visualization modes defined in `src/types.ts` as `VisMode`:
- `VINYL`, `DOT_MATRIX`, `CASSETTE`, `WALKMAN`, `CD`, `DVD`, `RADIO`, `SPACE`, `NEURAL`, `GLYPH_PULSE`, `ANALOG_SCOPE`, `BENTO_GRID`, `ORBITAL`, `GLITCH_TUNNEL`, `ZEN_RING`.
- Each visualizer component should be located in `src/components/visualizers/`.

## Environment Effects
The application supports environmental immersion modes defined in `src/types.ts` as `EnvironmentMode`:
- `NONE`, `RAIN`, `STORM`, `WIND`, `SNOW`, `MIST`.
- Logic is handled in `src/components/EnvironmentEffects.tsx`.

## Coding Standards
- Use Tailwind CSS for all styling.
- Use Framer Motion (`motion/react`) for all animations.
- Icons must be from `lucide-react`.
- State is managed via `zustand` in `src/store/usePlayerStore.ts`.
- Ensure high performance for canvases and animations.
