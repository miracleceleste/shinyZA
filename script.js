// Application State
let state = {
    activeHunts: [],
    caughtPokemon: [],
    currentHunt: null // Track which hunt is being viewed
};

let pendingHunt = null; // Temporary storage for hunt being set up

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeNavigation();
    initializeMap();
    initializePokedex();
    initializeSettings();
    renderHuntsList();
    updatePokedexCount();
});

// State Management
function loadState() {
    const saved = localStorage.getItem('shinyTrackerZA');
    if (saved) {
        state = JSON.parse(saved);
    }
}

function saveState() {
    localStorage.setItem('shinyTrackerZA', JSON.stringify(state));
}

// Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            showPage(page);
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}-page`).classList.add('active');
}

// Map
function initializeMap() {
    document.querySelectorAll('.zone-marker').forEach(marker => {
        marker.addEventListener('click', () => {
            const zone = parseInt(marker.dataset.zone);
            openZoneModal(zone);
        });
    });
    updateZoneIndicators();
}

function updateZoneIndicators() {
    document.querySelectorAll('.zone-marker').forEach(marker => {
        const zone = parseInt(marker.dataset.zone);
        const hasHunt = state.activeHunts.some(h => h.zone === zone);
        marker.classList.toggle('has-hunt', hasHunt);
    });
}

function openZoneModal(zoneNum) {
    const zoneData = ZONE_DATA[zoneNum];
    document.getElementById('zone-number').textContent = zoneNum;
    
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';
    
    zoneData.pokemon.forEach(pokemon => {
        const btn = document.createElement('button');
        btn.className = 'pokemon-btn';
        btn.textContent = pokemon;
        btn.onclick = () => {
            closeModal('zone-modal');
            openSetupModal(zoneNum, pokemon);
        };
        pokemonList.appendChild(btn);
    });
    
    openModal('zone-modal');
}

// Setup Modal
function openSetupModal(zone, pokemon) {
    pendingHunt = { zone, pokemon };
    
    document.getElementById('setup-pokemon').textContent = pokemon;
    document.getElementById('setup-zone').textContent = zone;
    
    // Reset form
    document.querySelector('input[name="shiny-charm"][value="no"]').checked = true;
    document.getElementById('hunting-method').value = 'Fast Travel';
    
    openModal('setup-modal');
}

document.getElementById('confirm-hunt-btn').addEventListener('click', () => {
    const hasShinyCharm = document.querySelector('input[name="shiny-charm"]:checked').value === 'yes';
    const method = document.getElementById('hunting-method').value;
    
    const hunt = {
        id: Date.now(),
        zone: pendingHunt.zone,
        pokemon: pendingHunt.pokemon,
        encounters: 0,
        startTime: new Date().toISOString(),
        method: method,
        hasShinyCharm: hasShinyCharm
    };
    
    state.activeHunts.push(hunt);
    state.currentHunt = hunt.id;
    saveState();
    
    closeModal('setup-modal');
    updateZoneIndicators();
    renderHuntsList();
    openHuntScreen(hunt);
});

// Hunt Screen
function openHuntScreen(hunt) {
    state.currentHunt = hunt.id;
    
    // Set title and image
    document.getElementById('hunt-pokemon-title').textContent = hunt.pokemon;
    const pokemonImg = document.getElementById('hunt-pokemon-img');
    pokemonImg.src = `Images/${hunt.pokemon.toLowerCase()}.jpg`;
    pokemonImg.alt = hunt.pokemon;
    pokemonImg.onerror = () => {
        pokemonImg.src = 'Images/placeholder.jpg'; // Fallback
    };
    
    // Set hunt info
    document.getElementById('encounter-count').textContent = hunt.encounters;
    document.getElementById('hunt-start-time').textContent = new Date(hunt.startTime).toLocaleString();
    document.getElementById('hunt-odds').textContent = hunt.hasShinyCharm ? '1/1024' : '1/4096';
    
    updateProbabilities(hunt);
    
    // Show hunt screen
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('hunt-screen').classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
}

function updateProbabilities(hunt) {
    const p = hunt.hasShinyCharm ? (1/1024) : (1/4096);
    const n = hunt.encounters;
    
    // Binomial probability: 1 - (1-p)^n
    const probability = n > 0 ? (1 - Math.pow(1 - p, n)) * 100 : 0;
    document.getElementById('hunt-probability').textContent = probability.toFixed(2) + '%';
    
    // Encounters needed for 90% probability
    if (n === 0) {
        document.getElementById('until-90').textContent = '-';
    } else {
        const until90 = Math.ceil(Math.log(0.1) / Math.log(1 - p));
        const remaining = Math.max(0, until90 - n);
        document.getElementById('until-90').textContent = remaining;
    }
}

// Counter Buttons
document.getElementById('increment-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        const incrementValue = parseInt(document.getElementById('increment-value').value) || 1;
        hunt.encounters += incrementValue;
        document.getElementById('encounter-count').textContent = hunt.encounters;
        updateProbabilities(hunt);
        saveState();
        renderHuntsList();
    }
});

document.getElementById('decrement-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        const incrementValue = parseInt(document.getElementById('increment-value').value) || 1;
        hunt.encounters = Math.max(0, hunt.encounters - incrementValue);
        document.getElementById('encounter-count').textContent = hunt.encounters;
        updateProbabilities(hunt);
        saveState();
        renderHuntsList();
    }
});

// Increment value input validation
document.addEventListener('DOMContentLoaded', () => {
    const incrementInput = document.getElementById('increment-value');
    if (incrementInput) {
        incrementInput.addEventListener('change', () => {
            let value = parseInt(incrementInput.value);
            if (isNaN(value) || value < 1) {
                incrementInput.value = 1;
            } else if (value > 999) {
                incrementInput.value = 999;
            }
        });
    }
});

// Hunt Actions
document.getElementById('found-shiny-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        openCatchModal(hunt, false);
    }
});

document.getElementById('phase-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        openPhaseModal(hunt);
    }
});

document.getElementById('end-hunt-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt && confirm('End this hunt?')) {
        state.activeHunts = state.activeHunts.filter(h => h.id !== hunt.id);
        state.currentHunt = null;
        saveState();
        updateZoneIndicators();
        renderHuntsList();
        showPage('hunts');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-page="hunts"]').classList.add('active');
    }
});

document.getElementById('back-to-hunts').addEventListener('click', () => {
    state.currentHunt = null;
    showPage('hunts');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="hunts"]').classList.add('active');
});

function getActiveHunt() {
    return state.activeHunts.find(h => h.id === state.currentHunt);
}

// Phase Modal
function openPhaseModal(originalHunt) {
    const zoneData = ZONE_DATA[originalHunt.zone];
    
    document.getElementById('zone-number').textContent = originalHunt.zone;
    const modal = document.getElementById('zone-modal');
    modal.querySelector('h2').innerHTML = `Phase - Zone ${originalHunt.zone}`;
    
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '<p class="modal-subtitle">Which Pokémon did you find?</p>';
    
    zoneData.pokemon.forEach(pokemon => {
        const btn = document.createElement('button');
        btn.className = 'pokemon-btn';
        btn.textContent = pokemon;
        btn.onclick = () => {
            closeModal('zone-modal');
            const phaseHunt = { ...originalHunt, pokemon: pokemon };
            openCatchModal(phaseHunt, true);
        };
        pokemonList.appendChild(btn);
    });
    
    openModal('zone-modal');
}

// Catch Modal
function openCatchModal(hunt, isPhase) {
    document.getElementById('catch-title').textContent = isPhase ? 'Phase Caught!' : 'Caught Shiny!';
    document.getElementById('catch-pokemon-name').textContent = hunt.pokemon;
    
    // Reset form
    document.querySelector('input[name="gender"][value="genderless"]').checked = true;
    document.getElementById('catch-level').value = 1;
    document.getElementById('is-alpha').checked = false;
    document.getElementById('catch-notes').value = '';
    
    // Store context
    document.getElementById('save-catch-btn').onclick = () => {
        saveCatch(hunt, isPhase);
        closeModal('catch-modal');
        
        if (!isPhase) {
            // Ask if want to continue
            document.getElementById('continue-pokemon').textContent = hunt.pokemon;
            openModal('continue-modal');
        }
    };
    
    document.getElementById('cancel-catch-btn').onclick = () => {
        closeModal('catch-modal');
    };
    
    openModal('catch-modal');
}

function saveCatch(hunt, isPhase) {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const level = parseInt(document.getElementById('catch-level').value);
    const isAlpha = document.getElementById('is-alpha').checked;
    const notes = document.getElementById('catch-notes').value;
    
    const catchData = {
        id: Date.now(),
        pokemon: hunt.pokemon,
        zone: hunt.zone,
        encounters: hunt.encounters,
        dateCaught: new Date().toISOString(),
        gender: gender,
        level: level,
        isAlpha: isAlpha,
        isPhase: isPhase,
        notes: notes,
        odds: hunt.hasShinyCharm ? '1/1024' : '1/4096',
        method: hunt.method
    };
    
    state.caughtPokemon.push(catchData);
    saveState();
    updatePokedex();
    updatePokedexCount();
}

// Continue Modal
document.getElementById('continue-yes-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        hunt.encounters = 0;
        saveState();
        document.getElementById('encounter-count').textContent = hunt.encounters;
        updateProbabilities(hunt);
        renderHuntsList();
    }
    closeModal('continue-modal');
});

document.getElementById('continue-no-btn').addEventListener('click', () => {
    const hunt = getActiveHunt();
    if (hunt) {
        state.activeHunts = state.activeHunts.filter(h => h.id !== hunt.id);
        state.currentHunt = null;
        saveState();
        updateZoneIndicators();
        renderHuntsList();
        showPage('hunts');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-page="hunts"]').classList.add('active');
    }
    closeModal('continue-modal');
});

// Hunts List
function renderHuntsList() {
    const container = document.getElementById('hunts-list');
    
    if (state.activeHunts.length === 0) {
        container.innerHTML = '<p class="empty-state">No active hunts. Select a zone from the map!</p>';
        return;
    }
    
    container.innerHTML = '';
    state.activeHunts.forEach(hunt => {
        const card = document.createElement('div');
        card.className = 'hunt-card';
        card.onclick = () => openHuntScreen(hunt);
        
        const odds = hunt.hasShinyCharm ? '1/1024' : '1/4096';
        
        card.innerHTML = `
            <div class="hunt-card-header">
                <div class="hunt-card-title">${hunt.pokemon}</div>
                <div class="zone-badge">Zone ${hunt.zone}</div>
            </div>
            <div class="hunt-card-info">
                ${hunt.encounters} encounters • ${odds} odds
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Pokédex
function initializePokedex() {
    const grid = document.getElementById('pokedex-grid');
    
    Object.entries(POKEDEX_DATA).forEach(([num, name]) => {
        const entry = document.createElement('div');
        entry.className = 'dex-entry';
        entry.dataset.pokemon = name;
        
        const isCaught = state.caughtPokemon.some(p => p.pokemon === name);
        if (isCaught) entry.classList.add('caught');
        
        const spriteDiv = document.createElement('div');
        spriteDiv.className = 'dex-sprite';
        
        // Always load the image, but apply silhouette effect if not caught
        const img = document.createElement('img');
        img.src = `Images/${name.toLowerCase()}.jpg`;
        img.alt = name;
        img.onerror = () => {
            // Fallback to "?" if image doesn't exist
            img.style.display = 'none';
            spriteDiv.textContent = '?';
        };
        
        if (!isCaught) {
            img.classList.add('silhouette');
        }
        
        spriteDiv.appendChild(img);
        
        entry.innerHTML = `
            <div class="dex-number">#${num.toString().padStart(3, '0')}</div>
            <div class="dex-name">${name}</div>
        `;
        entry.insertBefore(spriteDiv, entry.firstChild);
        
        // Make ALL entries clickable
        entry.onclick = () => {
            if (isCaught) {
                openDexDetail(name);
            } else {
                openManualEntryModal(name);
            }
        };
        
        grid.appendChild(entry);
    });
    
    // Search
    document.getElementById('dex-search').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        document.querySelectorAll('.dex-entry').forEach(entry => {
            const name = entry.dataset.pokemon.toLowerCase();
            entry.style.display = name.includes(search) ? 'block' : 'none';
        });
    });
}

function updatePokedex() {
    document.querySelectorAll('.dex-entry').forEach(entry => {
        const name = entry.dataset.pokemon;
        const isCaught = state.caughtPokemon.some(p => p.pokemon === name);
        
        if (isCaught && !entry.classList.contains('caught')) {
            entry.classList.add('caught');
            
            const spriteDiv = entry.querySelector('.dex-sprite');
            const img = spriteDiv.querySelector('img');
            
            if (img) {
                // Remove silhouette effect
                img.classList.remove('silhouette');
            } else {
                // If image doesn't exist yet, create it
                spriteDiv.textContent = '';
                const newImg = document.createElement('img');
                newImg.src = `Images/${name.toLowerCase()}.jpg`;
                newImg.alt = name;
                newImg.onerror = () => newImg.style.display = 'none';
                spriteDiv.appendChild(newImg);
            }
            
            entry.onclick = () => openDexDetail(name);
        }
    });
}

function updatePokedexCount() {
    const count = new Set(state.caughtPokemon.map(p => p.pokemon)).size;
    document.getElementById('caught-count').textContent = count;
}

function openDexDetail(pokemon) {
    document.getElementById('dex-detail-name').textContent = pokemon;
    const catches = state.caughtPokemon.filter(p => p.pokemon === pokemon);
    
    const content = document.getElementById('dex-detail-content');
    content.innerHTML = '<h3 style="margin-bottom: 15px;">Caught Shinies:</h3>';
    
    catches.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'entry-container';
        
        // Determine if this is a manual entry or hunted
        const entryType = c.isManualEntry ? '📝 Manual Entry' : '🎯 Hunted';
        
        let detailsHTML = `
            <h4>Catch #${i + 1} ${entryType}</h4>
            <p><strong>Date:</strong> ${new Date(c.dateCaught).toLocaleString()}</p>
        `;
        
        // Add hunt-specific details only if not manual entry
        if (!c.isManualEntry) {
            detailsHTML += `
                <p><strong>Zone:</strong> ${c.zone}</p>
                <p><strong>Encounters:</strong> ${c.encounters}</p>
                <p><strong>Odds:</strong> ${c.odds}</p>
                <p><strong>Method:</strong> ${c.method}</p>
                <p><strong>Phase:</strong> ${c.isPhase ? 'Yes' : 'No'}</p>
            `;
        }
        
        // Common details
        detailsHTML += `
            <p><strong>Gender:</strong> ${c.gender}</p>
            <p><strong>Level:</strong> ${c.level}</p>
            <p><strong>Alpha:</strong> ${c.isAlpha ? 'Yes' : 'No'}</p>
            ${c.notes ? `<p><strong>Notes:</strong> ${c.notes}</p>` : ''}
        `;
        
        div.innerHTML = detailsHTML;
        
        // Add delete button for each entry
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete-entry';
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteEntry(c.id, pokemon);
        };
        div.appendChild(deleteBtn);
        
        content.appendChild(div);
    });
    
    // Add button to add another entry
    const addAnotherBtn = document.createElement('button');
    addAnotherBtn.className = 'btn-primary';
    addAnotherBtn.textContent = '+ Add Another Entry';
    addAnotherBtn.style.marginTop = '15px';
    addAnotherBtn.onclick = () => {
        closeModal('dex-detail-modal');
        openManualEntryModal(pokemon);
    };
    content.appendChild(addAnotherBtn);
    
    openModal('dex-detail-modal');
}

// Delete entry function
function deleteEntry(entryId, pokemonName) {
    if (confirm('Delete this entry? This cannot be undone!')) {
        // Remove the entry from caughtPokemon array
        state.caughtPokemon = state.caughtPokemon.filter(p => p.id !== entryId);
        saveState();
        
        // Check if there are any remaining catches of this Pokémon
        const remainingCatches = state.caughtPokemon.filter(p => p.pokemon === pokemonName);
        
        if (remainingCatches.length === 0) {
            // If no more catches, update the Pokédex to show as uncaught with silhouette
            const dexEntry = document.querySelector(`.dex-entry[data-pokemon="${pokemonName}"]`);
            if (dexEntry) {
                dexEntry.classList.remove('caught');
                const img = dexEntry.querySelector('.dex-sprite img');
                if (img) {
                    img.classList.add('silhouette');
                }
                dexEntry.onclick = () => openManualEntryModal(pokemonName);
            }
            updatePokedexCount();
            closeModal('dex-detail-modal');
        } else {
            // If there are still catches, refresh the detail view
            openDexDetail(pokemonName);
        }
    }
}

// Manual Entry Modal
function openManualEntryModal(pokemon) {
    // Create a temporary modal for manual entry
    const modal = document.getElementById('catch-modal');
    
    // Reuse catch modal but customize it
    document.getElementById('catch-title').textContent = 'Add to Pokédex';
    document.getElementById('catch-pokemon-name').textContent = pokemon;
    
    // Reset form
    document.querySelector('input[name="gender"][value="genderless"]').checked = true;
    document.getElementById('catch-level').value = 1;
    document.getElementById('is-alpha').checked = false;
    document.getElementById('catch-notes').value = '';
    
    // Store the pokemon name temporarily
    modal.dataset.manualPokemon = pokemon;
    modal.dataset.isManual = 'true';
    
    // Update save button handler
    const saveBtn = document.getElementById('save-catch-btn');
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.onclick = () => {
        saveManualEntry(pokemon);
        closeModal('catch-modal');
    };
    
    openModal('catch-modal');
}

function saveManualEntry(pokemon) {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const level = parseInt(document.getElementById('catch-level').value);
    const isAlpha = document.getElementById('is-alpha').checked;
    const notes = document.getElementById('catch-notes').value;
    
    const entry = {
        id: Date.now(),
        pokemon: pokemon,
        zone: 'N/A',
        encounters: 0,
        dateCaught: new Date().toISOString(),
        gender: gender,
        level: level,
        isAlpha: isAlpha,
        isPhase: false,
        notes: notes,
        odds: 'Manual Entry',
        method: 'Manual Entry',
        isManualEntry: true
    };
    
    state.caughtPokemon.push(entry);
    saveState();
    updatePokedex();
    updatePokedexCount();
}

// Settings
function initializeSettings() {
    document.getElementById('export-data').addEventListener('click', exportData);
    
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    
    document.getElementById('import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const imported = JSON.parse(evt.target.result);
                if (confirm('This will replace all current data. Continue?')) {
                    state = imported;
                    saveState();
                    location.reload();
                }
            } catch (err) {
                alert('Error importing data. Invalid file.');
            }
        };
        reader.readAsText(file);
    });
    
    document.getElementById('reset-data').addEventListener('click', () => {
        if (confirm('DELETE ALL DATA? This cannot be undone!')) {
            if (confirm('Final warning: All hunts and catches will be permanently deleted!')) {
                state = { activeHunts: [], caughtPokemon: [], currentHunt: null };
                saveState();
                location.reload();
            }
        }
    });
}

function exportData() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `shiny-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Modal Helpers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal buttons
document.getElementById('close-zone-modal').addEventListener('click', () => closeModal('zone-modal'));
document.getElementById('close-dex-modal').addEventListener('click', () => closeModal('dex-detail-modal'));

// Click outside modal to close
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});
