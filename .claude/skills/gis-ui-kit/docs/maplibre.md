# Map recipes

## MapLibre (LAMBAT)
- **Borders that read on every fill:** dark casing line (ink, 60%) under a thin white line; width interpolated by zoom.
- **Selection:** 8 px white halo under a 3.5 px ink line. **Hover:** a separate ink outline layer on top of everything.
- **Zero class:** near-white fill plus a diagonal hatch pattern; its own legend swatch.
- **Classing:** 5 quantile classes from the data + the zero class; one-hue ramp in tints of the brand.
- **3D:** `fill-extrusion` height = value, a tiny plinth stepped by code so equal neighbours keep an edge; redraw casing above low columns only.
- **Quiet basemap:** hide labels the data already carries, drop duplicate label layers, dim labels to 55% and roads to 50%.
- **Labels:** biggest first; try right → left → below → above; avoid placed labels, circles, the column, the island and controls; hide if no spot.
- **Controls:** 44 px buttons; attribution at `--t-xs`.

## Leaflet (lighter, for prepaid data)
- Load Leaflet with a dynamic import only when the map is shown.
- Markers that need keyboard access: `L.marker` with `L.divIcon` (focusable), styled as LAMBAT `.rank` (32 px gold circle, 2 px white border, ink number in the display face; hover/selected ring `0 0 0 4px ink`).
- Secondary points: small `circleMarker`s in the brand colour at 60% so the gold ones read as "act here".
- Quiet raster: prefer a light, low-label tile style for production; OSM standard tiles are busy (and their public servers are not for production traffic).
- `invalidateSize()` after any column, sheet or drawer change; fit bounds with padding that clears the column and the island.
