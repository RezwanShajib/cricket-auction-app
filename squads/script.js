let state;
let selectedTeam;

//DOM: Team Header
const header = document.getElementById("header");

//Team Data Section
const playersSigned = document.getElementById("players-signed");
const spendBudget = document.getElementById("budget-spend");
const remainingBudget = document.getElementById("budget-remaining");

//Players Section
const batterSection = document.getElementById("batter-section");
const bowlerSection = document.getElementById("bowler-section");
const allrounderSection = document.getElementById("allrounder-section");
const wkSection = document.getElementById("wk-section");

//Player count
const batterCount = document.getElementById("batter-count");
const bowlerCount = document.getElementById("bowler-count");
const allrounderCount = document.getElementById("allrounder-count");
const wkCount = document.getElementById("wk-count");


function renderTeamsData() {
    for(let i = 0; i < state.teams.length; i++){
        let teamID = state.teams[i].team_id;

        //Create new team card for header
        let newTeam = document.createElement("div");
        newTeam.classList.add("team-container");
        newTeam.id = "team-" + teamID;

        newTeam.innerHTML = `
            <div class="logo-container"><img src="../assets/teams-logo/team_${teamID}.png" class="logo-img" id="logo-${teamID}"></div>
            <div class="name-container" id="name-container-${teamID}"><span id="team-name-${teamID}">${state.teams[i].team_name}</span></div>
            `;

        //Add element inside the header
        header.append(newTeam);

        //Add click event for new team
        newTeam.addEventListener("click", () => {
            selectedTeam = teamID;
            showPlayers(selectedTeam);
        });
    }
}

//Showing Price as M and K format. It looks better.
function showAmount(amount) {
    if(amount <= 1000){
        show_amount = amount;
    } else if(amount >= 1000000){
        show_amount = (amount / 1000000).toFixed(2) + "M";
    } else if(amount > 1000){
        show_amount = Math.floor(amount / 1000) + "K";
    } else if(amount <= 0) {
        show_amount = "Error!";
    }

    return show_amount;
}

function showPlayers(teamId) {
    const team = state.teams.find(t => t.team_id === teamId);
    
    //Team Data Update
    playersSigned.innerText = team.players.length;
    spendBudget.innerText = showAmount(team.total_cost);
    remainingBudget.innerText = showAmount(team.remaining_budget);

    //Update Selected Team color
    const selectedTeamCard = document.getElementById(`name-container-${team.team_id}`);
    selectedTeamCard.style.backgroundColor = team.color;
    selectedTeamCard.style.color = "white";

    //Show all the players list of the team
    //Batters

    let totalBatters = 0;

    for(let i = 0; i < team.players.length; i++){
        //Find the player with the id stored in team players list
        const player = state.players.find(p => p.id === team.players[i]);
        /* In team's object, all players id are saved */


        if(player.role === "Batter") {
            let newPlayerCard = document.createElement("div");
            newPlayerCard.classList.add("player-card");

            newPlayerCard.id = `player-${player.id}`;

            newPlayerCard.innerHTML = `
                    <div class="image-box"><img src="../assets/players-photo/player_${player.id}.jpg" alt="Player Photo" class="player-photo"></div>
                    <div class="player-name"><span id="player-name">${player.name}</span></div>
                    <div class="batting-style">🏏&nbsp;<span id="batting-style">${player.battingStyle}</span></div>
                    <div class="bowling-style">⚾ &nbsp;<span id="bowling-style">${player.bowlingStyle}</span></div>
                    <div class="final-price">$ &nbsp; <span id="final-price">${showAmount(player.finalPrice)}</span></div>
            `;
            //Push it inside batters section
            batterSection.append(newPlayerCard);

            totalBatters++;
        }

    }

    //Show Batter counts in UI
    batterCount.innerText = totalBatters;
    
    //If no batters to show
    if(totalBatters === 0){
        let msg = document.createElement("div");
        msg.classList.add("no-players");

        msg.innerText = "No player to show.";

        //Add message inside the batters section
        batterSection.append(msg);
    }


    //Bowlers

    let totalBowlers = 0;

    for(let i = 0; i < team.players.length; i++){
        //Find the player with the id stored in team players list
        const player = state.players.find(p => p.id === team.players[i]);
        /* In team's object, all players id are saved */


        if(player.role === "Bowler") {
            let newPlayerCard = document.createElement("div");
            newPlayerCard.classList.add("player-card");

            newPlayerCard.id = `player-${player.id}`;

            newPlayerCard.innerHTML = `
                    <div class="image-box"><img src="../assets/players-photo/player_${player.id}.jpg" alt="Player Photo" class="player-photo"></div>
                    <div class="player-name"><span id="player-name">${player.name}</span></div>
                    <div class="batting-style">🏏&nbsp;<span id="batting-style">${player.battingStyle}</span></div>
                    <div class="bowling-style">⚾ &nbsp;<span id="bowling-style">${player.bowlingStyle}</span></div>
                    <div class="final-price">$ &nbsp; <span id="final-price">${showAmount(player.finalPrice)}</span></div>
            `;
            //Push it inside batters section
            bowlerSection.append(newPlayerCard);

            totalBowlers++;
        }

    }

    //Show Bowler counts in UI
    bowlerCount.innerText = totalBowlers;
    
    //If no bowler to show
    if(totalBowlers === 0){
        let msg = document.createElement("div");
        msg.classList.add("no-players");

        msg.innerText = "No player to show.";

        //Add message inside the bowlers section
        bowlerSection.append(msg);
    }


    //All-Rounders

    let totalAllRounders = 0;

    for(let i = 0; i < team.players.length; i++){
        //Find the player with the id stored in team players list
        const player = state.players.find(p => p.id === team.players[i]);
        /* In team's object, all players id are saved */


        if(player.role === "All-Rounder") {
            let newPlayerCard = document.createElement("div");
            newPlayerCard.classList.add("player-card");

            newPlayerCard.id = `player-${player.id}`;

            newPlayerCard.innerHTML = `
                    <div class="image-box"><img src="../assets/players-photo/player_${player.id}.jpg" alt="Player Photo" class="player-photo"></div>
                    <div class="player-name"><span id="player-name">${player.name}</span></div>
                    <div class="batting-style">🏏&nbsp;<span id="batting-style">${player.battingStyle}</span></div>
                    <div class="bowling-style">⚾ &nbsp;<span id="bowling-style">${player.bowlingStyle}</span></div>
                    <div class="final-price">$ &nbsp; <span id="final-price">${showAmount(player.finalPrice)}</span></div>
            `;
            //Push it inside All-Rounders section
            batterSection.append(newPlayerCard);

            totalAllRounders++;
        }

    }

    //Show All-Rounders counts in UI
    allrounderCount.innerText = totalAllRounders;
    
    //If no All-Rounder to show
    if(totalAllRounders === 0){
        let msg = document.createElement("div");
        msg.classList.add("no-players");

        msg.innerText = "No player to show.";

        //Add message inside the All-Rounder section
        allrounderSection.append(msg);
    }


    //Wicket-Keepers

    let totalWK = 0;

    for(let i = 0; i < team.players.length; i++){
        //Find the player with the id stored in team players list
        const player = state.players.find(p => p.id === team.players[i]);
        /* In team's object, all players id are saved */


        if(player.role === "Wicket-Keeper") {
            let newPlayerCard = document.createElement("div");
            newPlayerCard.classList.add("player-card");

            newPlayerCard.id = `player-${player.id}`;

            newPlayerCard.innerHTML = `
                    <div class="image-box"><img src="../assets/players-photo/player_${player.id}.jpg" alt="Player Photo" class="player-photo"></div>
                    <div class="player-name"><span id="player-name">${player.name}</span></div>
                    <div class="batting-style">🏏&nbsp;<span id="batting-style">${player.battingStyle}</span></div>
                    <div class="bowling-style">⚾ &nbsp;<span id="bowling-style">${player.bowlingStyle}</span></div>
                    <div class="final-price">$ &nbsp; <span id="final-price">${showAmount(player.finalPrice)}</span></div>
            `;
            //Push it inside batters section
            batterSection.append(newPlayerCard);

            totalWK++;
        }

    }

    //Show WK counts in UI
    wkCount.innerText = totalWK;
    
    //If no WKs to show
    if(totalWK === 0){
        let msg = document.createElement("div");
        msg.classList.add("no-players");

        msg.innerText = "No player to show.";

        //Add message inside the WKs section
        wkSection.append(msg);
    }
}

function runSquadsPage() {
    const savedDataJSON = localStorage.getItem('auctionData');

    if (savedDataJSON) {
        // Load state and show squads
        const savedData = JSON.parse(savedDataJSON);
        state = savedData.auctionState;
        console.log('Data loaded successfully.');
    } else {
        // Replace all content with the message
        document.querySelector(".king-container").innerHTML = `
            <div class="no-data">AUCTION HAS NOT STARTED</div>
            <style>
                
                .no-data {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 5rem;
                    font-weight: bold;
                    background: #fff;
                    z-index: 1;
                    color: white;
                    background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 46%, rgba(219, 169, 68, 1) 100%);
                }
            </style>
        `;

        return;
    }

    //Render teams data
    renderTeamsData();

    //Show Team's players list
    selectedTeam = state.teams[0].team_id;
    showPlayers(selectedTeam);
}

document.addEventListener("DOMContentLoaded", runSquadsPage);