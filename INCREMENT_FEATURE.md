# Update: Custom Increment Value! 🔢

## What's New

You can now **customize how much the +/- buttons add or subtract** for rapid encounter tracking!

## How It Works

### New Control Box
Between the counter buttons and hunt info, there's now an **"Increment by:"** input box:
- Default value: **1** (classic one-by-one tracking)
- Set it to **5** to add/subtract 5 at a time
- Set it to **10** to add/subtract 10 at a time
- Set it to **50** for super-fast batch tracking
- Any value from **1 to 999**!

### Usage Examples

**Scenario 1: Single Encounter Tracking**
- Keep increment at `1`
- Hit + for each encounter
- Classic method

**Scenario 2: Batch Checking**
- Just checked 10 spawns quickly
- Set increment to `10`
- Hit + once
- Boom! 10 encounters added

**Scenario 3: Fast Travel Method**
- Loading between zones gives you 5 spawns
- Set increment to `5`
- Hit + after each load
- Much faster!

**Scenario 4: Correction**
- Accidentally miscounted by 20
- Set increment to `20`
- Hit - once
- Fixed!

## Features

✅ **Real-time updates** - Changes apply immediately
✅ **Validation** - Automatically corrects invalid inputs
✅ **Range limits** - Min: 1, Max: 999
✅ **Smart defaults** - Starts at 1 for normal tracking
✅ **Minus button support** - Subtracts by the same amount
✅ **Never goes negative** - Counter stops at 0

## Design

The increment control has the same modern styling as the rest of the hunt screen:
- **Glass morphism effect** - Matches info box style
- **Rounded input** - Clean, modern appearance
- **Focus effect** - Purple highlight when typing
- **Centered layout** - Easy to see and adjust

## Benefits

⚡ **Faster tracking** - No more clicking 50+ times
🎯 **Flexibility** - Adapt to different hunting methods
🔧 **Easy corrections** - Fix mistakes quickly
📊 **Still accurate** - Just faster to input

## Common Use Cases

**Despawn Method:**
Set to 5-10 for quick spawn checking

**Fast Travel:**
Set to the number of spawns per travel

**Bench Reset:**
Set to spawns per reset cycle

**Mass Checking:**
Set to high numbers for outbreak-style hunting

**One-by-One:**
Keep at 1 for traditional tracking

## Tips

💡 **Change mid-hunt** - Adjust anytime during your hunt
💡 **Keyboard friendly** - Tab to input, type value, Enter to confirm
💡 **Quick reset** - Type `1` to go back to single increments
💡 **Visual feedback** - Purple border shows when input is active

## Input Validation

The input automatically handles edge cases:
- **Empty/Invalid** → Resets to 1
- **Below 1** → Resets to 1  
- **Above 999** → Caps at 999
- **Decimals** → Rounds to whole number

---

**Happy fast-tracking!** 🚀

Now you can hunt at YOUR pace - whether that's careful one-by-one or rapid batch updates! ✨
