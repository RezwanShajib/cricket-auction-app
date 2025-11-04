/**
 * A helper function to format money values
 * This must be defined in this file to be used here.
 */
function showAmount(amount) {
    if (!amount && amount !== 0) return 'N/A';
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${Math.floor(amount / 1000)}K`;
    return amount;
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Load all data from localStorage
    const savedDataJSON = localStorage.getItem('auctionData');
    if (!savedDataJSON) {
        document.body.innerHTML = '<h1>Error: Auction data not found.</h1>';
        return;
    }

    const savedData = JSON.parse(savedDataJSON);
    const state = savedData.auctionState;
    // Use the "master list" of all players
    const allPlayers = state.allPlayers || state.players; 
    const allTeams = state.teams;

    // 2. Populate Header (with path fix)
    if (state.tournament) {
        // --- PATH FIX ---
        // Go up TWO levels (from /squads/roster/ to /)
        document.getElementById('tournament-logo').src = `../../${state.tournament.logo}`;
        document.getElementById('tournament-name').textContent = `${state.tournament.name} - ${state.tournament.year}`;
    } else {
        // --- PATH FIX ---
        document.getElementById('tournament-logo').src = '../../assets/tournament-logo.png';
        document.getElementById('tournament-name').textContent = 'Full Player Roster';
    }

    // 3. Define Helper Functions for building the table

    // This is just the table header row
    const tableHeaderHTML = `
        <tr>
            <th class="col-id-cat">ID / Cat</th>
            <th class="col-photo">Photo</th>
            <th class="col-player">Player (Base) / Club</th>
            <th class="col-role">Role / Styles</th>
            <th class="col-status">Status (Price)</th>
        </tr>`;

    // This function creates the HTML for a single player table row
    const createPlayerRow = (player) => {
        let statusHTML = '<span class="player-subtext">Unsold</span>';
        if (player.status === 'sold') {
            const team = allTeams.find(t => t.team_id === player.team);
            statusHTML = `
                <span class="status-team">${team ? team.team_name : 'N/A'}</span>
                <span class="player-subtext">(${showAmount(player.finalPrice)})</span>
            `;
        } else if (player.status === 'skipped') {
            statusHTML = '<span class="player-subtext">Skipped</span>';
        }

        return `
            <tr>
                <td>
                    <span class="player-name">${player.id}</span>
                    <span class="player-subtext">Category: ${player.category}</span>
                </td>
                <td class="player-photo">
                    <img src="${player.photo}" alt="${player.name}">
                </td>
                <td>
                    <span class="player-name">${player.name}</span>
                    <span class="player-subtext">(${showAmount(player.basePrice)})</span>
                    <span class="player-subtext">${player.currentClub}</span>
                </td>
                <td>
                    <span class="player-name">${player.role}</span>
                    <span class="player-subtext">Bat: ${player.battingStyle}</span>
                    <span class="player-subtext">Ball: ${player.bowlingStyle || 'N/A'}</span>
                </td>
                <td>${statusHTML}</td>
            </tr>`;
    };

    // 4. Process Data
    const sortedPlayers = allPlayers.sort((a, b) => a.id - b.id);

    const batters = sortedPlayers.filter(p => p.role === 'Batter');
    const bowlers = sortedPlayers.filter(p => p.role === 'Bowler');
    const allrounders = sortedPlayers.filter(p => p.role === 'All-Rounder');
    const wks = sortedPlayers.filter(p => p.role === 'Wicket-Keeper');

    // 5. Build Tables Correctly
    
    // Helper function to build a full table (header + rows)
    const buildTable = (tableElement, players) => {
        const thead = tableElement.querySelector('thead');
        const tbody = tableElement.querySelector('tbody');

        thead.innerHTML = tableHeaderHTML;
        tbody.innerHTML = ''; // Clear old body content

        if (players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; font-style:italic;">No players in this role.</td></tr>';
        } else {
            tbody.innerHTML = players.map(createPlayerRow).join('');
        }
    };

    // Build all four tables
    buildTable(document.getElementById('batter-table'), batters);
    buildTable(document.getElementById('bowler-table'), bowlers);
    buildTable(document.getElementById('allrounder-table'), allrounders);
    buildTable(document.getElementById('wk-table'), wks);

    // 6. Auto-trigger print dialog
    // This will now run successfully
    window.print();
});