document.addEventListener('DOMContentLoaded', () => {
    // A helper function you already have
    const showAmount = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 1000) return `${Math.floor(amount / 1000)}K`;
        return amount;
    };

    // --- Main Logic ---
    const savedDataJSON = localStorage.getItem('auctionData');
    if (!savedDataJSON) {
        document.body.innerHTML = '<h1>Error: Auction data not found.</h1>';
        return;
    }

    const savedData = JSON.parse(savedDataJSON);
    const state = savedData.auctionState;
    
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = parseInt(urlParams.get('team'));
    const team = state.teams.find(t => t.team_id === teamId);

    if (!team) {
        document.body.innerHTML = `<h1>Error: Team with ID ${teamId} not found.</h1>`;
        return;
    }

    // 1. Populate Header
    document.getElementById('tournament-logo').src = `../${state.tournament.logo}`; // Or from state if available
    document.getElementById('tournament-name').textContent = state.tournament.name; // Or from state

    // 2. Populate Team Info
    document.getElementById('team-name').textContent = team.team_name;
    document.getElementById('players-signed').textContent = team.player_bought;
    document.getElementById('total-spend').textContent = showAmount(team.total_cost);
    document.getElementById('budget-remaining').textContent = showAmount(team.remaining_budget);
    document.getElementById('total-budget').textContent = showAmount(team.team_budget);

    // 3. Populate Player Table
    const playerListBody = document.getElementById('player-list');
    playerListBody.innerHTML = ''; // Clear any placeholder content
    
    const teamPlayers = team.players.map(pId => state.allPlayers.find(p => p.id === pId));

    teamPlayers.forEach(player => {
        if (player) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.id}</td>
                <td>${player.category}</td>
                <td>${player.name}</td>
                <td>${player.role}</td>
                <td>${showAmount(player.basePrice)}</td>
                <td>${showAmount(player.finalPrice)}</td>
            `;
            playerListBody.appendChild(row);
        }
    });

    if(teamPlayers.length == 0){
        const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6"><center>No player signed.<center></td>
            `;
            playerListBody.appendChild(row);
    }

    // 4. Automatically trigger the print dialog
    window.print();
});