## Work Section: Three Horizontal Projects with Media

- [x] Review current Work section implementation and data shape.
- [x] Update the Work section layout to show exactly three projects in a horizontal row on desktop.
- [x] Add media rendering support for image, GIF, and MP4/WebM-style video assets per project.
- [x] Verify the site builds successfully with `bun run build`.
- [x] Add a short implementation review note.

### Scope Check

Request interpreted as:
- Show only these three projects: `OKU`, `FirstDevJob`, and `CE Equipment Solutions`.
- Display those projects horizontally on larger screens (responsive stack on small screens).
- Render each project's `image` field as either image/GIF or video depending on file extension.

### Review Notes

- Updated `MyWork.astro` to select the requested three projects explicitly by title.
- Preserved horizontal desktop layout via `md:grid-cols-3` and responsive stacking on mobile.
- Media slot now supports image/GIF rendering and MP4/WebM/Ogg/Mov video rendering.
- Verified with `bun run build` (success).
