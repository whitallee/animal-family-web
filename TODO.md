# To-Do

## Fixes

- [ ] Glitchy when quick jumping to task
- [ ] Make home screen scrollbar invisible or pushed further right
- [ ] URL query params cause jumping on every reload — clicking navbar should clear param, opening an accordion should update it
- [ ] Home screen doesn't show animals after deleting their enclosure without deleting them — needs refresh
- [ ] After deleting an animal, enclosure, or task, remove it from URL query if present
- [ ] Make Family and Tasks pages unnavigable while off screen
- [ ] Make delete enclosure options a radio button selection (user must choose exactly one action)

## Core Features

- [ ] Transfer animals feature
- [ ] Change creation drawer to modal/dialog with step-by-step flow
- [ ] Add settings section in UserDrawer
- [ ] Toggle visibility for In Memorium section in settings
- [ ] Create enclosure with animals that already exist in the family
- [ ] Sort options and preferences for family lists, home page, and tasks
- [ ] Show completed tasks underneath animal and enclosure accordions by default (with toggle)
- [ ] Add/remove animals in enclosure button
- [ ] Consider redoing UserDrawer as a dialog box

## Transfer Features (MVP Goal)

- [ ] **Permanent ownership transfer (adopt out)**
  - [ ] Generate barcode/link for transfer
  - [ ] Authentication on both ends (sender and recipient)
  - [ ] UI for displaying and scanning/clicking transfer link

- [ ] **Temporary transfer for pet sitters**
  - [ ] Ensure structure supports multiple owners
  - [ ] Generate barcode/link for pet sitter access
  - [ ] Set time limit for temporary access
  - [ ] Maintain original owner access during transfer
  - [ ] Automatic revocation after time limit expires
  - [ ] UI for managing temporary transfers

## Future Features

- [ ] **AI-generated content** (requires backend)
  - [ ] AI-generated species info
  - [ ] AI-generated habitat info

- [ ] **Animal history/timeline** (requires backend)
  - [ ] Ownership transfer history
  - [ ] Vet visits, medical history, vaccination records
  - [ ] Timeline UI component

- [ ] **Task history** (requires backend)
  - [ ] Task completion history
  - [ ] Overall action history for easy reversal

- [ ] Lineage tracking (if there's enough demand)
- [ ] Admin page
