# Pokémon Legends Z-A Shiny Tracker

A mobile-optimized shiny hunting tracker for Pokémon Legends Z-A with an interactive Lumiose City map!

## 🎮 Features

- **Interactive Map**: Click zones on the actual Lumiose City map
- **Streamlined Hunt Flow**: Zone → Pokémon → Setup → Hunt (no extra clicks!)
- **Per-Hunt Shiny Charm**: Set odds individually for each hunt
- **Live Statistics**: Encounter counter, probability calculations, progress to 90%
- **Phase Tracking**: Log unexpected shinies without ending your hunt
- **Complete Pokédex**: All 230 Pokémon from Legends Z-A
- **Mobile Optimized**: Designed to use on your phone while playing
- **Local Storage**: All data saved in your browser
- **Export/Import**: Backup and restore your progress

## 📋 Setup Instructions

### 1. Required Files

Place these files in the same folder:
- `index.html`
- `styles.css`
- `script.js`
- `data.js`

### 2. Create Images Folder

Create a folder called `Images` (capital I) in the same location as your HTML file.

### 3. Add the Lumiose Map

Place your `lumiose-map.jpg` file inside the `Images` folder.

### 4. Add Pokémon Images

Add shiny Pokémon images to the `Images` folder with these naming rules:

**Naming Convention:**
- All lowercase
- No special characters
- Format: `pokemonname.jpg`

**Examples:**
```
bulbasaur.jpg
charmander.jpg
pikachu.jpg
mr. mime.jpg  (keep the space and period)
flabébé.jpg   (remove the accent)
nidoran♀.jpg  (remove the symbol, just: nidoranf.jpg)
nidoran♂.jpg  (remove the symbol, just: nidoranm.jpg)
```

**Handling Special Cases:**
- **Flabébé** → `flabebe.jpg` (remove accent)
- **Nidoran♀** → `nidoranf.jpg` (f for female)
- **Nidoran♂** → `nidoranm.jpg` (m for male)
- **Mr. Mime** → `mr. mime.jpg` (keep space and period)

## 🎯 How to Use

### Starting a Hunt

1. **Map Page**: Tap a Wild Zone number
2. **Select Pokémon**: Choose which Pokémon to hunt
3. **Setup**:
   - Do you have Shiny Charm? (Yes/No)
   - Select hunting method
4. **Confirm**: Immediately goes to hunt screen!

### Hunt Screen

- **Large Counter**: Shows current encounters
- **+/− Buttons**: Increment/decrement encounters
- **Pokémon Image**: Displays the shiny you're hunting
- **Statistics**:
  - Start time
  - Probability (1/4096 or 1/1024)
  - B(n,p): Current probability of success
  - Until 90%: Encounters needed for 90% odds

### Catching Shinies

**Found Shiny Button**: When you find your target
1. Fill in details (gender, level, alpha status, notes)
2. Save to Pokédex
3. Choose to continue hunting or end

**Phase Button**: When you find a different shiny
1. Select which Pokémon you actually found
2. Fill in details
3. Your original hunt continues!

### Managing Hunts

- **Hunts Tab**: View all active hunts
- **Tap a Hunt**: Return to that hunt screen
- **End Hunt**: Stop tracking (ask for confirmation)
- **Back Button**: Return to hunts list

### Pokédex

- Browse all 230 Pokémon
- Caught shinies show in gold with images
- Uncaught show as silhouettes
- Tap caught entries to view details
- Search by name

## 📊 Statistics Explained

**B(n,p) - Binomial Probability:**
The cumulative probability of finding at least one shiny after n encounters with probability p per encounter.

Formula: 1 - (1-p)^n

**Until 90%:**
How many more encounters you need to reach a 90% cumulative probability of finding a shiny.

## 💾 Data Management

### Export Data
- Downloads a JSON file with all your hunts and catches
- Backup regularly!
- Date is automatically added to filename

### Import Data
- Upload a previously exported JSON file
- Restores all hunts and catches
- Replaces current data (use carefully!)

### Reset Data
- Deletes everything permanently
- Double confirmation required
- Cannot be undone!

## 🖼️ Image Requirements

**Recommended Specs:**
- Format: JPG or PNG
- Size: 150-300px square works well
- Quality: Clear, recognizable shinies
- Transparent backgrounds look best

**Where to Get Images:**
- Serebii.net
- Bulbapedia
- Your own screenshots
- Pokémon HOME sprites

**If Image is Missing:**
The tracker will still work! It just won't display the image. A placeholder will show instead.

## 📱 Mobile Usage Tips

1. **Add to Home Screen**: For quick access
2. **Landscape Mode**: Works great for the map
3. **Keep Screen On**: Use your phone's settings
4. **Backup Regularly**: Export before long sessions

## 🔧 Customization

### Adjust Zone Positions

In `index.html`, find the zone markers:
```html
<div class="zone-marker" data-zone="1" style="top: 78%; left: 50%;">1</div>
```

Change the `top` and `left` percentages to reposition zones on your map.

### Change Colors

In `styles.css`, modify the CSS variables:
```css
:root {
    --primary-color: #4CAF50;  /* Green buttons */
    --secondary-color: #2196F3; /* Blue accents */
    --danger-color: #f44336;    /* Red buttons */
}
```

### Add Hunting Methods

In `data.js`, edit the `HUNTING_METHODS` array:
```javascript
const HUNTING_METHODS = [
    "Fast Travel",
    "Bench Reset",
    "Your Custom Method"
];
```

## 🐛 Troubleshooting

**Map not showing:**
- Check `lumiose-map.jpg` is in the `Images` folder
- Check the filename matches exactly (case-sensitive)

**Pokémon images not loading:**
- Verify filenames are all lowercase
- Check for special characters
- Make sure files are in `Images` folder

**Data not saving:**
- Check browser allows localStorage
- Don't use incognito/private mode
- Clear browser cache if issues persist

**Page looks broken:**
- Make sure all 4 files are in the same folder
- Check no files were renamed
- Try a different browser

## 📂 File Structure

```
your-folder/
├── index.html
├── styles.css
├── script.js
├── data.js
└── Images/
    ├── lumiose-map.jpg
    ├── bulbasaur.jpg
    ├── charmander.jpg
    ├── pikachu.jpg
    └── ... (230 Pokémon images)
```

## ⚠️ Important Notes

- **Browser Storage**: Data is stored locally in your browser
- **Clearing Browser Data**: Will delete all your hunts!
- **Multiple Devices**: Use Export/Import to transfer between devices
- **No Cloud Sync**: Everything is local
- **Private Browsing**: Will not save data after closing

## 🎨 Pokémon List (All 230)

The tracker includes all Pokémon from Legends Z-A in Lumiose Dex order:
- Starters: Chikorita, Tepig, Totodile
- Kalos Pokémon: Full regional dex
- Kanto Starters: Bulbasaur, Charmander, Squirtle
- Legendaries: Xerneas, Yveltal, Zygarde

## 💡 Pro Tips

1. **Use the Phase Feature**: Don't restart hunts for random shinies!
2. **Screenshot Before Catching**: For your records
3. **Export After Big Catches**: Keep backups
4. **Track Multiple Zones**: Hunt several Pokémon at once
5. **Check Statistics**: Until 90% helps set expectations

## 🔮 Future Ideas

Want to add features? Here are some ideas:
- Dark mode toggle
- Hunt timer
- Shiny sound notification
- Statistics graphs
- Longest hunt tracking
- Average encounters calculation
- Multiple hunt profiles

## 📞 Support

Having issues?
1. Check the Troubleshooting section
2. Verify file structure
3. Try a different browser
4. Clear cache and reload

## 📜 Credits

- Created for Pokémon Legends Z-A shiny hunters
- Zone data from official sources
- Community hunting methods
- Designed for mobile-first usage

Happy shiny hunting! ✨

---
**Note:** This tracker is a fan-made tool and is not affiliated with Nintendo, Game Freak, or The Pokémon Company.
