let handlers = []; // save references here [it will use to remove event listener of the teams]

//History stack
let history = {
        undoStack: [],
        redoStack: []
}

let state = {
        players: [],
        teams: [],
        auctionCount: 0,
        soldCount: 0,
        unsoldCount: 0,
        soldPlayers: [],
        unsoldPlayers: [],
        skippedPlayers: []
    };

const getTournamentData = async () => {
    const response = await fetch("data/tournament.json");
    // Return the fetched data directly
    return await response.json();
};

//Get the player data as array of objects from the players.json file
const getPlayersData = async () => {
    const response = await fetch("data/players.json");
    // Instead of assigning to a variable, return the data directly
    return await response.json();
};
//Get teams data
const getTeamsData = async () => {
    const response = await fetch("data/teams.json");
    // Return the data directly
    return await response.json();
};

//DOM Manipulation
let playerName = document.getElementById("player-name");
let playerPhoto = document.getElementById("player-image")
let playerRole = document.getElementById("player-role");
let playerBattingStyle = document.getElementById("player-batting-style");
let playerBowlingStyle = document.getElementById("player-bowling-style");
let playerClub = document.getElementById("player-club");
let playerCategory = document.getElementById("player-category");
let playerId = document.getElementById("player-id");
let playerBasePrice = document.getElementById("base-price");

let currentBidAmount = document.getElementById("current-bid");
let currentBidTeam = document.getElementById("current-bid-team");

//Button DOM's
let undoButton   = document.getElementById("undo-button");
let redoButton   = document.getElementById("redo-button");
let resetButton  = document.getElementById("reset-button");
let teamsButton  = document.getElementById("teams-button");
let skipButton   = document.getElementById("skip-button");
let unsoldButton = document.getElementById("unsold-button");
let soldButton   = document.getElementById("sold-button");
let nextButton   = document.getElementById("next-button");

//Seal DOM
unsoldSeal = document.getElementById("unsold-seal");
soldSeal = document.getElementById("sold-seal");

//Teams' Button DOM
let team_1 = document.getElementById("team-1");
let team_2 = document.getElementById("team-2");
let team_3 = document.getElementById("team-3");
let team_4 = document.getElementById("team-4");
let team_5 = document.getElementById("team-5");
let team_6 = document.getElementById("team-6");
let team_7 = document.getElementById("team-7");
let team_8 = document.getElementById("team-8");

//Teams' Data DOM
const teamData = [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({
    logo:   document.getElementById(`logo-${i}`),
    name:   document.getElementById(`team-name-${i}`),
    budget_remaining: document.getElementById(`money-remaining-${i}`),
    player_bought: document.getElementById(`taken-player-${i}`)
}));
//teamData[0].logo -> logo elements of team 1


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

//This Function is used to show tounament details in the screen
function showTournamentDetails() {
    // Check if tournament data exists before trying to display it
    if (!state.tournament) return;

    // Combine the name and year for a more descriptive title
    const fullTitle = `${state.tournament.name} - ${state.tournament.year}`;
    
    document.querySelector(".tournament-logo").src = state.tournament.logo;
    document.querySelector(".headline").innerText = fullTitle;
}

//this function will show specific player details in the UI
function showPlayerDetails(i) {
    playerName.innerText = state.players[i].name;
    playerRole.innerText = state.players[i].role;
    // playerPhoto.src = state.players[i].photo;                             //Have to change it later
    playerBattingStyle.innerText = state.players[i].battingStyle;
    playerBowlingStyle.innerText = state.players[i].bowlingStyle;
    playerClub.innerText = state.players[i].currentClub;
    playerCategory.innerText = state.players[i].category;
    playerId.innerText = state.players[i].id;
    playerBasePrice.innerText = showAmount(state.players[i].basePrice);

    if(state.players[i].bids.length === 0){
        currentBidAmount.innerText = "00K";
        currentBidTeam.innerText = "NO BIDS";
        document.querySelector(".current-bid-team").style.backgroundColor = "#282829";
    } else {
        const lastBid = state.players[i].bids[state.players[i].bids.length - 1];
        const teamIndex = lastBid.team - 11;    //team_id starts from 11

        currentBidAmount.innerText = showAmount(lastBid.amount);
        currentBidTeam.innerText = state.teams[teamIndex].team_name;
        document.querySelector(".current-bid-team").style.backgroundColor = state.teams[teamIndex].color;
    }


    //Button visibility settings
    if(state.players[state.auctionCount].status == "sold" || state.players[state.auctionCount].status == "unsold"){
        soldButton.style.display = "none";
        unsoldButton.style.display = "none";
        nextButton.style.display = "block";
    } else {
        if(state.players[state.auctionCount].bids.length == 0){
            soldButton.style.display = "none";
            unsoldButton.style.display = "block";
            nextButton.style.display = "none";
        } else {
            soldButton.style.display = "block";
            unsoldButton.style.display = "none";
            nextButton.style.display = "none";
        }
    }
}

function showTeamData(team_id) {
    let i = team_id - 11; // Team ID starts from 11 (10+1) and teamData contain first team object at index 0 (1-1)

    teamData[i].logo.src = `assets/teams-logo/team_${team_id}.png`;
    teamData[i].name.innerText = state.teams[i].team_name;
    teamData[i].budget_remaining.innerText = showAmount(state.teams[i].remaining_budget);
    teamData[i].player_bought.innerText = state.teams[i].player_bought;
}

function bidPlayer(team_id) {
       
    let bidAmount;
    let teamIndex = team_id - 11;

    const player =  state.players[state.auctionCount];      //Take a copy of the player's object
    const team = state.teams[teamIndex];          //Take a copy of the team's object

    //Prevent bidding for any sold or unsold player
    if(player.status === "unsold" || player.status === "sold"){
        return;
    }


    if(player.bids.length === 0 && team.remaining_budget >= player.basePrice){   //while there are no bids for the player accept any bid, Bidder must have more money remaining than the players base price
        bidAmount = player.basePrice; //base price become the first bid amount
        
    } else {                                                    //while there are existing  bids for the player
        let lastBid = player.bids[player.bids.length - 1];      //Last bid object of the player

        // Prevent same team from bidding twice in a row
        if (lastBid.team != team_id && team.remaining_budget >= lastBid.amount + 5000) {        //Make sure bidder has more money remaining than the player's next bid amount
            bidAmount = lastBid.amount + 5000;
        } else {
            console.log(lastBid.team == team_id ? `${state.teams[teamIndex].team_name} tried to bid twice in a row. NOT ACCEPTED.` : `${state.teams[teamIndex].team_name} doesn't have enough money to bid for this player.`);
            return; // Don't update UI if bid not accepted
        }
    }

    //Save history
    saveHistory();
    
    state.players[state.auctionCount].bids.push({ team: team_id, amount: bidAmount }); //Add bid to the state.players original object object
    console.log(`${state.players[state.auctionCount].name} is bidded by ${state.teams[teamIndex].team_name}`);

    //Update the UI
    renderUI();

    //save current state to local storage
    saveData();
}

function saveData() {
    let data = {
        auctionState: state,
        historyData: history 
    }
    localStorage.setItem('auctionData', JSON.stringify(data));        //Save current state
    console.log("All data saved...")
}

function unsoldPlayer() {
    //Prevent player to unsold after a bid is placed
    if(state.players[state.auctionCount].bids.length > 0){
        console.log("A player can't be unsold because atleast one bid is placed.");
        return;
    }

    //Save history
    saveHistory();

    state.unsoldPlayers.push(state.players[state.auctionCount].id);   //Take the player id in the state.unsoldPlayers list
    state.players[state.auctionCount].status = "unsold";       // change the player status to unsold

    state.unsoldCount++;             //Increamented the unsold count

    console.log(`${state.players[state.auctionCount].name} remains unsold.`);

    unsoldSeal.style.display = "block"; //Show the unsold seal

    //Update Screen
    renderUI()

    //save current state to local storage
    saveData();
}

function soldPlayer() {
    //prevent player to be sold until a bid is placed
    if(state.players[state.auctionCount].bids.length === 0){
        console.log("Can't sold this player because no bid is placed");
        return;
    }

    //Save history
    saveHistory();

    const player = state.players[state.auctionCount];  //current_player
    state.soldPlayers.push(player.id);       //add player id in the sold players list

    //change the status of the player at the main player object at the players array
    state.players[state.auctionCount].status = "sold";

    state.soldCount++;       //increase the sold player count

    //Define the last bid of the player
    const lastBid = player.bids[player.bids.length - 1];        //take the final bid of the players

    //Update the main player object
    state.players[state.auctionCount].finalPrice = lastBid.amount;
    state.players[state.auctionCount].team = lastBid.team;

    const teamIndex = lastBid.team - 11;         //team_id - 11 [Team ID starts from 11]

    //update the main team object
    state.teams[teamIndex].players.push(player.id);       //add the player id in the state.teams' player list
    state.teams[teamIndex].player_bought++;               //Increase total numbers of player
    state.teams[teamIndex].total_cost += lastBid.amount;        //Update teams' total cost
    state.teams[teamIndex].remaining_budget = state.teams[teamIndex].team_budget - state.teams[teamIndex].total_cost;        //Update teams' remaining budget

    console.log(`${player.name} is sold to ${state.teams[teamIndex].team_name}`);

    //Update the UI with updated team data
    showTeamData(lastBid.team);

    //Show the SOLD seal
    soldSeal.style.display = "block";

    //Update Screem
    renderUI();


    //save current state to local storage
    saveData();
}

function nextPlayer() {
    state.auctionCount++;         //Increase the auction count

    //Show next players' data in the UI
    renderUI();

    console.log(`${state.players[state.auctionCount].name}'s data loaded`);

    //Hide All Seals
    unsoldSeal.style.display = "none"; //Hide the unsold seal
    soldSeal.style.display = "none"; //Hide the sold seal
}

function skipPlayer() {
    //Save history
    saveHistory();

    //Prevent skipping a player once Bidded
    if(state.players[state.auctionCount].bids.length != 0) {
        console.log("Can't skip this player because bid is placed.");
        return;
    }

    state.players[state.auctionCount].status = "skipped";      //Change the player status to "skipped"
    console.log(`${state.players[state.auctionCount].name} is skipped`);

    state.skippedPlayers.push(state.players[state.auctionCount].id);        //add players id to skipped players list

    //Load Next Player's Data
    nextPlayer();

    //save current state to local storage
    saveData();
}

function renderUI() {
    if (state.auctionCount >= state.players.length) {
        alert("The auction is finished!");

        state.auctionCount = 0;
        
        showPlayerDetails(0);

        for (let i = 0; i < state.teams.length; i++) {
        showTeamData(state.teams[i].team_id);
        }

        endAuction();

        return;
    }
    
    showPlayerDetails(state.auctionCount);
    for (let i = 0; i < state.teams.length; i++) {
        showTeamData(state.teams[i].team_id);
    }
}

function resetAll() {
    //remove all saved data from localStorage
    localStorage.removeItem('auctionData');

    //reload the page
    window.location.reload();

    //initApp function is already designed to start a fresh auction if it can't find any saved data
}

//UNDO-REDO Functionality
function saveHistory() {
    //Clear the redostack
    history.redoStack = [];

    //Add a snapshot (deep copy) in the undoStack
    history.undoStack.push(JSON.parse(JSON.stringify(state)));

    //clear oldest history (Optional)
    // if(history.undoStack.length > 20) {
    //     history.undoStack.shift();
    // }
}

function undoChange() {
    //If the undoStack is empty then we have nothing to do
    if(history.undoStack.length == 0){
        console.log("Error: There is nothing to undo.");
        return;
    }

    //Save current state to redoStack
    history.redoStack.push(JSON.parse(JSON.stringify(state)));

    //delete last state from from the undoStack
    const lastState = history.undoStack.pop();
    state = lastState;

    console.log("Undone changes.");

    //update UI
    renderUI();

    //Save the current state
    saveData();


    //Show the seal if necessary
    if(state.players[state.auctionCount].status == "sold"){
        soldSeal.style.display = "block";
    } else if(state.players[state.auctionCount].status == "unsold") {
        unsoldSeal.style.display = "block";
    } else {
        soldSeal.style.display = "none";
        unsoldSeal.style.display = "none";
    }
}

function redoChange() {
    //If the redoStack is empty then we have nothing to do
    if(history.redoStack.length == 0){
        console.log("Error: There is nothing to redo.");
        return;
    }

    //Save current state to redoStack
    history.undoStack.push(JSON.parse(JSON.stringify(state)));

    console.log("Redone changes.");

    //delete last state from from the undoStack
    const nextState = history.redoStack.pop();
    state = nextState;

    //update UI
    renderUI();

    //Save the current state
    saveData();


    //Show the seal if necessary
    if(state.players[state.auctionCount].status == "sold"){
        soldSeal.style.display = "block";
    } else if(state.players[state.auctionCount].status == "unsold") {
        unsoldSeal.style.display = "block";
    } else {
        soldSeal.style.display = "none";
        unsoldSeal.style.display = "none";
    }
}

function endAuction() {
    console.log("All players have been auctioned. The auction is now closed.");
    
    // Disable all action buttons
    soldButton.disabled = true;
    unsoldButton.disabled = true;
    skipButton.disabled = true;
    nextButton.disabled = true;
    undoButton.disabled = true;
    redoButton.disabled = true;
    
    // Disable bidding by removing all team click listeners
    for (let i = 0; i < state.teams.length; i++) {
        const teamElement = document.getElementById(`team-${i + 1}`);
        if (handlers[i]) {
            teamElement.removeEventListener("click", handlers[i]);
        }
    }

    // Save the final state
    saveData();
}

// Main App Logic
const initApp = async () => {
    // Load static tournament data first and update the UI immediately.
    try {
        state.tournament = await getTournamentData();
        showTournamentDetails();
    } catch (error) {
        console.error("Could not load tournament data:", error);
    }

    //check localStorage for saved data
    const savedDataJSON = localStorage.getItem('auctionData');

    if (savedDataJSON) {
        // If saved data exists, parse it and load it into our state
        let savedData = JSON.parse(savedDataJSON);
        state = savedData.auctionState;
        history =  savedData.historyData;

        console.log("Loaded saved state from localStorage.");


        // Check the status of the player at the loaded auction count
        if (state.auctionCount < state.players.length) {
            // This block now only runs if the player at auctionCount actually exists
            const lastPlayerStatus = state.players[state.auctionCount].status;
            if (lastPlayerStatus === "sold" || lastPlayerStatus === "unsold" || lastPlayerStatus === "skipped") {
                // If the last player's turn was over, increment the count.
                state.auctionCount++;
            }
        }

    } else {
        // If no saved data, fetch the initial JSON files
        console.log("No saved state found. Starting a new auction.");
        // Call the functions and assign their returned value directly to the state
        state.players = await getPlayersData();
        state.teams = await getTeamsData();
    }

    // This block runs for BOTH new and loaded states, ensuring UI is always in sync.
    renderUI();


    //Add event lister to every teams button
    //We save the references because when we need to remove the event listener then we can
    function makeBidHandler(teamId) {
        return function () {
            bidPlayer(teamId);
        }
    }

    
    for (let i = 0; i < state.teams.length; i++) {
        const teamElement = document.getElementById(`team-${i + 1}`);
        const handler = makeBidHandler(i + 11); // create the handler for this team
        handlers.push(handler);                 // save the reference
        teamElement.addEventListener("click", handler);
    }



     
    //Click event for Buttons
    unsoldButton.addEventListener("click", () => unsoldPlayer());
    nextButton.addEventListener("click", () => nextPlayer());
    soldButton.addEventListener("click", () => soldPlayer());
    skipButton.addEventListener("click", () => skipPlayer());

    teamsButton.addEventListener('click', () => {
    // This opens the page in a new tab (The browser will automatically look for index.html)
    window.open('squads/', '_blank');
    });

    resetButton.addEventListener("click", () => resetAll());
    undoButton.addEventListener("click", () => undoChange());
    redoButton.addEventListener("click", () => redoChange());
};

// 🔷 Make sure to run when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
