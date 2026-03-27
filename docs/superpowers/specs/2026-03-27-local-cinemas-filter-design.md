# Local Cinemas Filter & Exclude Big Chains Design Spec

**Date:** 2026-03-27
**Topic:** Kinobok - Local Cinemas Filter
**Status:** In Review

## 1. Overview
The goal of this feature is to encourage users of Kinobok to visit local, independent cinemas in Warsaw. By default, major cinema chains ("Multikino" and "Cinema City") will be filtered out of the map and the match results. A toggle will be provided to the user to include these big chains if they wish.

## 2. Success Criteria
- By default, only cinemas not starting with "Multikino" or "Cinema City" are visible.
- The "Matches Found" sidebar section only displays matches for the currently visible cinemas.
- A toggle in the Sidebar allows users to show/hide big cinema chains.
- Toggling the filter while a watchlist is uploaded immediately updates both the Map and the Matches list.

## 3. Architecture & Data Flow
Following "Approach 1: Filtered Data Propagation", the central state and filtering logic will reside in the main `Home` component (`page.tsx`).

### 3.1. State Management (`page.tsx`)
- `showBigChains` (boolean, default: `false`): Controls the visibility of major chains.
- `watchlistUris` (string[]): Stores the Letterboxd URIs parsed from the user's uploaded CSV.

### 3.2. Filtering Logic
A cinema is considered a "Big Chain" if its name starts with "Multikino", "Cinema City", "Helios", or "IMAX" (case-insensitive).
- **Filtered Cinemas:** `data.cinemas.filter(c => showBigChains || !isBigChain(c.name))`
- **Filtered Showtimes:** `data.showtimes.filter(s => filteredCinemas.some(fc => fc.id === s.cinema_id))`

### 3.3. Matching Logic
Matches are recalculated reactively:
1. Filter movies from `data.movies` that exist in `watchlistUris`.
2. Map these movies to their showtimes *only within the currently filtered cinemas*.
3. Filter out any movies from the `matches` array that have zero showtimes in the current filtered set.
4. Pass the resulting `matches` array to `MatchSidebar`.
5. Pass the `filteredCinemas` and `matchedCinemaIds` to `CinemaMap`.

## 4. Component Interfaces

### 4.1. `MatchSidebar` Props
- `matches`: Array of matched movies with their filtered showtimes.
- `showBigChains`: Current toggle state.
- `onWatchlistUpload`: Callback returning the parsed `watchlistUris`.
- `onToggleBigChains`: Callback to update the toggle state.

### 4.2. `CinemaMap` Props
- `cinemas`: Array of currently filtered cinemas.
- `highlightedCinemaIds`: Array of IDs for cinemas that have matches.

## 5. UI Requirements
- Add a checkbox/toggle in the Sidebar labeled "Show big cinema chains (Multikino, Cinema City)".
- The toggle should be clearly visible and explain its default state (encouraging local cinemas).

## 6. Implementation Plan Highlights
- Update `page.tsx` to handle matching and filtering logic.
- Refactor `MatchSidebar.tsx` to be more "stateless" regarding the matching results, receiving them instead as props.
- Ensure `watchlistUris` are persisted in state after upload.
