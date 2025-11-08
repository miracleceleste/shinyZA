# Update: Pokémon Silhouettes! 🌑

## What's New

The Pokédex now shows **silhouettes** instead of question marks for uncaught Pokémon - just like the real games!

## How It Works

**Uncaught Pokémon:**
- Display as **dark silhouettes** of the actual shiny sprite
- You can see the shape/outline but not the colors
- Creates mystery and anticipation
- Hover over them to make the silhouette slightly brighter

**Caught Pokémon:**
- Show the **full color shiny sprite**
- Gold gradient background
- ✓ checkmark in corner

## Technical Details

- Uses the same images for both caught and uncaught
- CSS `filter: brightness(0) opacity(0.4)` creates the silhouette effect
- Smooth transition when catching (silhouette → full color)
- Falls back to "?" if image file is missing

## New Behavior

1. **All Pokémon images load** - both caught and uncaught
2. **Uncaught get silhouette filter** - dark shadow effect
3. **Catching removes the filter** - reveals full shiny colors
4. **Deleting all entries** - returns to silhouette

## Benefits

✅ More authentic Pokémon experience
✅ You can see what shape/size the Pokémon is
✅ Makes catching feel more rewarding (silhouette → color reveal)
✅ Works perfectly with all 230 Pokémon images
✅ No performance impact

## Comparison

**Before:**
- Uncaught = "?"
- Looked plain and basic

**After:**
- Uncaught = Dark silhouette
- Looks like actual Pokémon games!
- More exciting to discover

## Perfect For

- Building anticipation for hunts
- Showing off your collection
- Getting that "gotta catch 'em all" feeling
- Authentic Pokédex experience

---

**Your tracker just got even more Pokémon-authentic!** 🎮✨

All 230 images will now work as silhouettes until you catch them!
