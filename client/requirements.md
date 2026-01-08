## Packages
framer-motion | Complex animations and page transitions
three | 3D tilt effects for cards
@types/three | Type definitions for Three.js

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
Dynamic images at /images/: project thumbnails should be handled via URL if dynamic, or Unsplash if static placeholders are needed.
Backend provides /api/projects for the grid.
