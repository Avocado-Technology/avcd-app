# Mobile performance QA checklist

Validate on real devices (iPhone Safari, Android Chrome). Automated Jest tests cannot measure interaction latency reliably.

## Interaction response (WCAG 2.2 guidance)

- [ ] Button press shows visible feedback immediately (active state / ripple)
- [ ] Theme toggle opens menu without lag
- [ ] Bottom navigation tab switches within ~300 ms perceived time
- [ ] Inputs focus without double-tap zoom (16px+ text)

## Navigation

- [ ] Bottom primary navigation clears content (no overlap with sticky header)
- [ ] Safe-area inset respected on home-indicator devices (padding feels natural)

## Org chart

- [ ] Pinch zoom responds smoothly
- [ ] Pan / scroll does not fight browser gestures

## Cold start

- [ ] First meaningful paint acceptable on 4G
