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

//DOM for Welcome Modal
let welcomeModal = document.getElementById("welcome-modal");
let welcomeResumeBtn = document.getElementById("welcome-resume-btn");
let welcomeStartNewBtn = document.getElementById("welcome-start-new-btn");
let welcomeResetBtn = document.getElementById("welcome-reset-btn");

//Buttons for Editing Budgets
let budgetModal = document.getElementById("budget-modal");
let modalCloseBtn = document.getElementById("modal-close-btn");
let budgetEditorList = document.getElementById("budget-editor-list");

//DOM for Direct Bidding
let directBidModal = document.getElementById("direct-bid-modal");
let directBidCloseBtn = document.getElementById("direct-bid-close-btn");
let teamSelectDropdown = document.getElementById("team-select-dropdown");
let directBidAmountInput = document.getElementById("direct-bid-amount");
let submitBidBtn = document.getElementById("submit-bid-btn");
let directBidForm = document.getElementById("direct-bid-form");

//DOM for Finish Screen
let roundEndModal = document.getElementById("round-end-modal");
let restartUnsoldBtn = document.getElementById("restart-unsold-btn");
let finishAuctionBtn = document.getElementById("finish-auction-btn");
let roundSummaryText = document.getElementById("round-summary-text");

//DOM for Final Finish Screen
let finishScreenModal = document.getElementById("finish-screen-modal");
let finishModalCloseBtn = document.getElementById("finish-modal-close-btn");

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


//Showing Price as M and K format. It looks better.
function showAmount(amount) {
    // if(amount <= 1000){
    //     show_amount = amount;
    // } else if(amount >= 1000000){
    //     show_amount = (amount / 1000000).toFixed(2) + "M";
    // } else if(amount > 1000){
    //     show_amount = Math.floor(amount / 1000) + "K";
    // } else if(amount <= 0) {
    //     show_amount = "Error!";
    // }

    return amount;
}

/**
 * Hides the welcome modal and starts the main UI.
 * This is called by the button handlers.
 */
function startMainApplication(isResuming) {
    if (isResuming) {
        // Fix auction count if the last loaded player was already done
        if (state.auctionCount < state.players.length) {
            const lastPlayerStatus = state.players[state.auctionCount].status;
            if (lastPlayerStatus === "sold" || lastPlayerStatus === "unsold" || lastPlayerStatus === "skipped") {
                state.auctionCount++;
            }
        }
    }
    
    // Render the UI for the first time
    renderUI();
    updateUndoRedoButtons();
    
    // Hide the modal
    welcomeModal.style.display = 'none';
}

/**
 * Click handler for "Resume Auction" button.
 */
function handleWelcomeResume() {
    console.log("Resuming auction...");
    // Data is already pre-loaded by initApp, just start the UI
    startMainApplication(true);
}

function closeWelcomeModal() {
    welcomeModal.style.display = 'none';
}

//This Function is used to show tounament details in the screen
function showTournamentDetails() {
    // Check if tournament data exists before trying to display it
    if (!state.tournament) return;

    // Combine the name and year for a more descriptive title
    const fullTitle = `${state.tournament.name} - ${state.tournament.year}`;
    
    document.querySelector(".tournament-logo").src = "/assets/tournament-logo.png";
    document.querySelector(".headline").innerText = fullTitle;
}

//this function will show specific player details in the UI
function showPlayerDetails(i) {
    playerName.innerText = state.players[i].name;
    playerRole.innerText = state.players[i].role;
    playerPhoto.src = state.players[i].photo;
    playerPhoto.alt = state.players[i].name;
    playerBattingStyle.innerText = state.players[i].battingStyle;
    playerBowlingStyle.innerText = state.players[i].bowlingStyle;
    playerClub.innerText = `${state.players[i].department} - ${state.players[i].batch}`;
    playerCategory.innerText = state.players[i].category;
    playerId.innerText = state.players[i].id;
    playerBasePrice.innerText = `🪙 ${showAmount(state.players[i].basePrice)}`;
    
    // playerPhoto.onerror = function() {
    //     this.src = 'assets/placeholder.png'; // Add a placeholder image
    // };

    if(state.players[i].bids.length === 0){
        currentBidAmount.innerText = "🪙 00";
        currentBidTeam.innerText = "NO BIDS";
        document.querySelector(".current-bid-team").style.backgroundColor = "#282829";
    } else {
        const lastBid = state.players[i].bids[state.players[i].bids.length - 1];
        const teamIndex = lastBid.team - 11;    //team_id starts from 11

        currentBidAmount.innerText = `🪙 ${showAmount(lastBid.amount)}`;
        currentBidTeam.innerText = state.teams[teamIndex].team_name;
        document.querySelector(".current-bid-team").style.backgroundColor = state.teams[teamIndex].color;
    }


    // --- 💡 NEW CONSOLIDATED UI LOGIC (Using classList) ---
    const playerStatus = state.players[i].status;
    const hasBids = state.players[i].bids.length > 0;

    // Use 'style.display' for buttons (this is fine)
    // Use 'classList' for seals
    if (playerStatus === "sold") {
        // Player is SOLD
        soldButton.style.display = "none";
        unsoldButton.style.display = "none";
        nextButton.style.display = "block";
        soldSeal.classList.add("show");     // Show SOLD
        unsoldSeal.classList.remove("show"); // Hide UNSOLD

    } else if (playerStatus === "unsold" || playerStatus === "skipped") {
        // Player is UNSOLD or SKIPPED
        soldButton.style.display = "none";
        unsoldButton.style.display = "none";
        nextButton.style.display = "block";
        soldSeal.classList.remove("show");  // Hide SOLD
        unsoldSeal.classList.add("show"); // Show UNSOLD

    } else { 
        // Player is "not-auctioned" (i.e., bidding is active)
        soldSeal.classList.remove("show");  // Hide SOLD
        unsoldSeal.classList.remove("show"); // Hide UNSOLD

        if (hasBids) {
            // Active with bids
            soldButton.style.display = "block";
            unsoldButton.style.display = "none";
            nextButton.style.display = "none";
        } else {
            // Active with NO bids
            soldButton.style.display = "none";
            unsoldButton.style.display = "block";
            nextButton.style.display = "none";
        }
    }
}

//Bid Increament
function bidIncrement(currentBid) {
  if (currentBid >= 1000) { // 1000k
    return 25; // Add 25k
  } else if (currentBid >= 500) { // 500k
    return 20; // Add 20k
  } else if (currentBid >= 200) { // 200k
    return 10; // Add 10k
  } else { // Less than 200k
    return 5; // Add 5k
  }
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
        if (lastBid.team != team_id && team.remaining_budget >= lastBid.amount + bidIncrement(lastBid.amount)) {        //Make sure bidder has more money remaining than the player's next bid amount
            bidAmount = lastBid.amount + bidIncrement(lastBid.amount);
        } else {
            console.log(lastBid.team == team_id ? `${state.teams[teamIndex].team_name} tried to bid twice in a row. NOT ACCEPTED.` : `${state.teams[teamIndex].team_name} doesn't have enough money to bid for this player.`);
            return; // Don't update UI if bid not accepted
        }
    }

    // Example: animate bid update
    const bidElement = document.getElementById("current-bid");
    bidElement.textContent = "350K";
    bidElement.classList.add("updated");
    setTimeout(() => bidElement.classList.remove("updated"), 400);


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

    const player = state.players[state.auctionCount];

    //Save history
    saveHistory();

    state.unsoldPlayers.push(player.id); // Use the new variable
    player.status = "unsold";            // Use the new variable

    const playerInMasterList = state.allPlayers.find(p => p.id === player.id);
    if (playerInMasterList) {
        playerInMasterList.status = "unsold";
    }

    state.unsoldCount++;             //Increamented the unsold count

    console.log(`${state.players[state.auctionCount].name} remains unsold.`);

    // unsoldSeal.style.display = "block"; //Show the unsold seal

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

    // --- 💡 FIX: UPDATE THE MASTER LIST (state.allPlayers) ---
    const playerInMasterList = state.allPlayers.find(p => p.id === player.id);
    if (playerInMasterList) {
        playerInMasterList.status = "sold";
        playerInMasterList.finalPrice = lastBid.amount;
        playerInMasterList.team = lastBid.team;
    }

    const teamIndex = lastBid.team - 11;         //team_id - 11 [Team ID starts from 11]

    //update the main team object
    state.teams[teamIndex].players.push(player.id);       //add the player id in the state.teams' player list
    state.teams[teamIndex].player_bought++;               //Increase total numbers of player
    state.teams[teamIndex].total_cost += lastBid.amount;        //Update teams' total cost
    state.teams[teamIndex].remaining_budget = state.teams[teamIndex].team_budget - state.teams[teamIndex].total_cost;        //Update teams' remaining budget

    console.log(`${player.name} is sold to ${state.teams[teamIndex].team_name}`);

    //Update the UI with updated team data
    renderTeams();

    //Show the SOLD seal
    // soldSeal.style.display = "block";

    //Update Screem
    renderUI();


    //save current state to local storage
    saveData();
}

function nextPlayer() {
    state.auctionCount++;         //Increase the auction count
    // saveHistory();

    //Show next players' data in the UI
    renderUI();

    // Only log the name if the auction is NOT over.
    if (state.auctionCount < state.players.length) {
        console.log(`${state.players[state.auctionCount].name}'s data loaded`);
    }

    //Hide All Seals
    // unsoldSeal.style.display = "none"; //Hide the unsold seal
    // soldSeal.style.display = "none"; //Hide the sold seal
}

function skipPlayer() {
    //Save history
    saveHistory();

    //Prevent skipping a player once Bidded
    if(state.players[state.auctionCount].bids.length != 0) {
        console.log("Can't skip this player because bid is placed.");
        return;
    }

    const player = state.players[state.auctionCount]; // Get player
    player.status = "skipped";           //Change the player status to "skipped"
    console.log(`${player.name} is skipped`);

    state.skippedPlayers.push(player.id);        //add players id to skipped players list

    // --- 💡 FIX: UPDATE THE MASTER LIST (state.allPlayers) ---
    const playerInMasterList = state.allPlayers.find(p => p.id === player.id);
    if (playerInMasterList) {
        playerInMasterList.status = "skipped";
    }
    // --- END OF FIX ---

    //Load Next Player's Data
    nextPlayer();

    //save current state to local storage
    saveData();
}

function renderTeams() {
    // === DYNAMIC TEAM RENDERING ===
    const container = document.getElementById('teams-data-section');
    container.innerHTML = ''; // Clear all existing team cards

    // Loop through the teams in the state
    state.teams.forEach(team => {
        const teamId = team.team_id;
        
        const teamElement = document.createElement('div');
        teamElement.className = 'team-container';
        teamElement.id = `team-${teamId}`; // Use the actual team_id
        
        // Dynamically create the HTML, filling in all data at once
        teamElement.innerHTML = `
            <div class="team-name-container">
                <div class="logo-container">
                    <img src="${team.logo}" class="logo-img" id="logo-${teamId}">
                </div>
                <div class="name-container" id="name-container-${teamId}" style="background-color: ${team.color || '#2c3e50'}; color: white;">
                    <span id="team-name-${teamId}">${team.team_name}</span>
                </div>
            </div>
            <div class="team-data-container">
                <div class="taken-player-icon">
                    <img src="assets/taken-player-icon.png" class="player-icon">
                </div>
                <div class="taken-player"><span id="taken-player-${teamId}">${team.player_bought}</span></div>
                <div class="money-icon"><span>🪙</span></div>
                <div class="money-remaining"><span id="money-remaining-${teamId}">${showAmount(team.remaining_budget)}</span></div>
            </div>
        `;
        
        // Add the click event listener directly to the new element
        teamElement.addEventListener("click", makeBidHandler(teamId));
        
        container.appendChild(teamElement);
    });
}




//Add event lister to every teams button
//We save the references because when we need to remove the event listener then we can
function makeBidHandler(teamId) {
    return function (event) { // Add 'event' as an argument
        if (event.ctrlKey) {
            // If shift key is pressed, open the squad page
            window.open(`squads/?team=${teamId}`, '_blank');
        } else {
            // Otherwise, place a bid
            bidPlayer(teamId);
        }
    }
}


    
// for (let i = 0; i < state.teams.length; i++) {
//     const teamElement = document.getElementById(`team-${i + 1}`);
//     const handler = makeBidHandler(i + 11); // create the handler for this team
//     handlers.push(handler);                 // save the reference
//     teamElement.addEventListener("click", handler);
    
// }

function renderUI() {
    if (state.auctionCount >= state.players.length) {
        // alert("The auction is finished!");
        // state.auctionCount = 0;
        // showPlayerDetails(0);
        // renderTeams();
        // endAuction();

        openRoundEndModal();
        return;
    }
    
    showPlayerDetails(state.auctionCount);
    renderTeams();
}

function resetAll() {
    const securityKey = prompt("Enter the security key to reset: (rezwan19)");

    if(securityKey === "rezwan19"){
        //remove all saved data from localStorage
        localStorage.removeItem('auctionData');

        //reload the page
        window.location.reload();
    } else {
        alert("Wrong security key!")
    }
    //initApp function is already designed to start a fresh auction if it can't find any saved data
}


//Functions for UNDO-REDO buttons visibility
function updateUndoRedoButtons() {
    undoButton.disabled = history.undoStack.length === 0;
    redoButton.disabled = history.redoStack.length === 0;
}

//UNDO-REDO Functionality
function saveHistory() {
    //Clear the redostack
    history.redoStack = [];

    //Add a snapshot (deep copy) in the undoStack
    history.undoStack.push(JSON.parse(JSON.stringify(state)));

    //clear oldest history (Optional)
    if(history.undoStack.length > 20) {
        history.undoStack.shift();
    }

    updateUndoRedoButtons();
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

    const currentPlayer = state.players[state.auctionCount];
    if (currentPlayer.status === "sold") {
        soldSeal.classList.add("show");
        unsoldSeal.classList.remove("show");
    } else if (currentPlayer.status === "unsold" || currentPlayer.status === "skipped") {
        unsoldSeal.classList.add("show");
        soldSeal.classList.remove("show");
    } else {
        soldSeal.classList.remove("show");
        unsoldSeal.classList.remove("show");
    }

    updateUndoRedoButtons();

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

    const currentPlayer = state.players[state.auctionCount];
    if (currentPlayer.status === "sold") {
        soldSeal.classList.add("show");
        unsoldSeal.classList.remove("show");
    } else if (currentPlayer.status === "unsold" || currentPlayer.status === "skipped") {
        unsoldSeal.classList.add("show");
        soldSeal.classList.remove("show");
    } else {
        soldSeal.classList.remove("show");
        unsoldSeal.classList.remove("show");
    }

    updateUndoRedoButtons();

}

function endAuction() {
    closeRoundEndModal(); // Close the modal first
    
    console.log("All players have been auctioned. The auction is now closed.");
    
    // Disable all action buttons
    soldButton.disabled = true;
    unsoldButton.disabled = true;
    skipButton.disabled = true;
    nextButton.disabled = true;
    undoButton.disabled = true;
    redoButton.disabled = true;
    
    // Disable bidding
    document.querySelectorAll('.team-container').forEach(el => {
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.7';
    });

    saveData();
    // Show the final summary screen
    showFinishScreen();
}


//====== BUDGETING =============================================
/**
 * Opens the budget editor modal and populates it with team data.
 */
function openBudgetModal() {
    budgetEditorList.innerHTML = ''; // Clear old list
    
    state.teams.forEach(team => {
        const row = document.createElement('div');
        row.className = 'budget-row';
        
        row.innerHTML = `
            <label for="budget-input-${team.team_id}">${team.team_name}</label>
            <input type="number" id="budget-input-${team.team_id}" value="${team.team_budget}" step="50000">
            <div class="budget-controls">
                <button data-team="${team.team_id}" data-action="subtract">-</button>
                <button data-team="${team.team_id}" data-action="add">+</button>
            </div>
        `;
        budgetEditorList.appendChild(row);
    });
    
    budgetModal.style.display = 'flex';
}

function closeBudgetModal() {
    budgetModal.style.display = 'none';
}

/**
 * Adjusts a team's total budget and recalculates their remaining budget.
 * Used for the +/- buttons.
 */
function adjustTeamBudget(teamId, amount) {
    saveHistory();
    const team = state.teams.find(t => t.team_id === teamId);
    if (!team) return;
    
    team.team_budget += amount;
    team.remaining_budget += amount;

    // Update the input field in the modal to show the new value
    const inputField = document.getElementById(`budget-input-${teamId}`);
    if (inputField) inputField.value = team.team_budget;
    
    renderUI();
    saveData();
}

/**
 * Sets a team's total budget to a new value from the input field.
 */
function setTeamBudget(teamId, newTotalBudget) {
    saveHistory();
    const team = state.teams.find(t => t.team_id === teamId);
    if (!team || isNaN(newTotalBudget)) return;

    // Calculate the *difference* and apply it to the remaining budget
    const budgetChange = newTotalBudget - team.team_budget;
    team.team_budget = newTotalBudget;
    team.remaining_budget += budgetChange;
    
    renderUI();
    saveData();
}


/**
 * Opens the Direct Bid modal.
 * It populates the team dropdown and suggests a new bid amount.
 */
function openDirectBidModal() {
    const player = state.players[state.auctionCount];
    
    // Don't open if auction is over or player is already sold
    if (player.status === "sold" || player.status === "unsold") return;

    // Populate team dropdown
    teamSelectDropdown.innerHTML = ''; // Clear old options
    state.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.team_id;
        option.textContent = `${team.team_name} ($${showAmount(team.remaining_budget)})`;
        teamSelectDropdown.appendChild(option);
    });

    // Set a suggested bid amount
    let suggestedAmount = player.basePrice;
    if (player.bids.length > 0) {
        suggestedAmount = player.bids[player.bids.length - 1].amount + 5000;
    }
    directBidAmountInput.value = suggestedAmount;

    directBidModal.style.display = 'flex';
}

function closeDirectBidModal() {
    directBidModal.style.display = 'none';
}

/**
 * Handles the logic for a custom "Direct Bid"
 */
function handleDirectBidSubmit(event) {
    event.preventDefault(); // Stop the form from reloading the page
    
    // 1. Get values from the form
    const teamId = parseInt(teamSelectDropdown.value);
    const amount = parseInt(directBidAmountInput.value);
    
    const player = state.players[state.auctionCount];
    const team = state.teams.find(t => t.team_id === teamId);

    // 2. --- Validation ---
    if (!team || isNaN(amount) || amount <= 0) {
        alert("Invalid input. Please check the team and amount.");
        return;
    }
    if (team.remaining_budget < amount) {
        alert(`${team.team_name} does not have enough budget for this bid!`);
        return;
    }
    if (player.bids.length === 0 && amount < player.basePrice) {
        alert(`The bid must be at least the base price of $${showAmount(player.basePrice)}.`);
        return;
    }
    if (player.bids.length > 0) {
        const lastBid = player.bids[player.bids.length - 1];
        if (amount <= lastBid.amount) {
            alert(`The bid must be higher than the current bid of $${showAmount(lastBid.amount)}.`);
            return;
        }
        if (lastBid.team === teamId) {
            alert(`${team.team_name} cannot bid twice in a row.`);
            return;
        }
    }

    // 3. --- Process the Bid ---
    saveHistory(); // Save for undo
    state.players[state.auctionCount].bids.push({ team: teamId, amount: amount });
    console.log(`DIRECT BID: ${player.name} bidded by ${team.team_name} for $${showAmount(amount)}`);
    
    renderUI(); // Update the main screen
    saveData(); // Save to localStorage
    closeDirectBidModal(); // Close the pop-up
}

/**
 * Opens the new modal when a round ends.
 */
function openRoundEndModal() {
    // Calculate how many players are left
    const unsoldCount = state.players.filter(
        p => p.status === 'unsold' || p.status === 'skipped'
    ).length;

    if (unsoldCount > 0) {
        roundSummaryText.innerText = `Round 1 Complete. ${unsoldCount} players remain.`;
        restartUnsoldBtn.style.display = "block";
    } else {
        roundSummaryText.innerText = "All players have been sold. The auction is complete.";
        restartUnsoldBtn.style.display = "none";
    }
    
    roundEndModal.style.display = 'flex';
}

function closeRoundEndModal() {
    roundEndModal.style.display = 'none';
}

/**
 * This is the function for your "Unsold Players" button.
 */
function restartAuctionForUnsold() {
    // 1. Find all players who weren't sold
    const newPlayerList = state.allPlayers.filter(
        p => p.status === 'unsold' || p.status === 'skipped'
    );

    if (newPlayerList.length === 0) {
        alert("There are no unsold or skipped players to re-auction.");
        return;
    }

    // 2. Save the current state so this can be undone
    saveHistory();

    // 3. Reset the status of these players so they can be auctioned again
    newPlayerList.forEach(player => {
        player.status = "not-auctioned"; // Set back to default status
        player.bids = []; // Clear old bids
        player.finalPrice = null;
        player.team = null;
    });

    // 4. Update the state
    state.players = newPlayerList;
    state.auctionCount = 0; // Reset the counter
    state.soldPlayers = []; // Clear for the new round
    state.unsoldPlayers = [];
    state.skippedPlayers = [];

    // 5. Close the modal and re-render the UI for the new round
    closeRoundEndModal();
    renderUI();
    saveData(); // Save the new "Round 2" state
}

/**
 * Closes the final summary screen.
 */
function closeFinishScreen() {
    finishScreenModal.style.display = "none";
}

/**
 * Calculates insights and shows the final summary screen.
 */
function showFinishScreen() {
    // 1. --- Calculate Insights ---
    let totalSpent = 0;
    const soldPlayers = state.allPlayers.filter(p => p.status === 'sold');
    
    soldPlayers.forEach(player => {
        totalSpent += player.finalPrice;
    });

    // Sort sold players by price (highest first)
    soldPlayers.sort((a, b) => b.finalPrice - a.finalPrice);
    
    // Get the top 3
    const top3Buys = soldPlayers.slice(0, 3);

    
    // 2. --- Populate Modal Content ---
    
    // Header
    document.getElementById('finish-tournament-logo').src = state.tournament ? `../../${state.tournament.logo}` : 'assets/tournament-logo.png';
    document.getElementById('finish-tournament-name').textContent = state.tournament ? `${state.tournament.name} - ${state.tournament.year}` : 'Auction Complete';
    
    // Simple Insights List
    const insightsList = document.getElementById('finish-insights-list');
    insightsList.innerHTML = `
        <li>Total Players Sold: <strong>${soldPlayers.length}</strong></li>
        <li>Total Money Spent: <strong>$${showAmount(totalSpent)}</strong></li>
    `;

    // Top 3 Buys
    const topBuysContainer = document.getElementById('finish-top-buys');
    topBuysContainer.innerHTML = ''; // Clear old cards
    
    for (const player of top3Buys) {
        const team = state.teams.find(t => t.team_id === player.team);
        const teamName = team ? team.team_name : 'N/A';
        const teamColor = team ? team.color : '#555';

        const cardHTML = `
            <div class="finish-player-card">
                <div class="card-photo">
                    <img src="${player.photo}" alt="${player.name}">
                </div>
                <div class="card-name">${player.name}</div>
                <div class="card-price">$${showAmount(player.finalPrice)}</div>
                <div class="card-team" style="background-color: ${teamColor};">
                    ${teamName}
                </div>
            </div>
        `;
        topBuysContainer.innerHTML += cardHTML;
    }
    
    // Team Logos
    const teamLogosContainer = document.getElementById('finish-team-logos');
    teamLogosContainer.innerHTML = ''; // Clear old logos
    state.teams.forEach(team => {
        teamLogosContainer.innerHTML += `<img src="assets/teams-logo/team_${team.team_id}.png" alt="${team.team_name}">`;
    });

    // Organizer (You can fill this in)
    // document.getElementById('finish-organizer-name').textContent = state.tournament.organizer;
    
    // **NOTE:** Make sure you have "organizer-photo.png" and "developer-photo.png"
    // in your "assets" folder, or change the src path in the HTML.

    // 3. --- Show the Modal ---
    finishScreenModal.style.display = 'flex';
}

/**
 * Calculates insights and shows the final summary screen.
 */
function showFinishScreen() {
    // 1. --- Calculate Insights ---
    let totalSpent = 0;
    const soldPlayers = state.allPlayers.filter(p => p.status === 'sold');
    
    soldPlayers.forEach(player => {
        totalSpent += player.finalPrice;
    });

    // Sort sold players by price (highest first)
    soldPlayers.sort((a, b) => b.finalPrice - a.finalPrice);
    
    // Get the top 3
    const top3Buys = soldPlayers.slice(0, 3);

    
    // 2. --- Populate Modal Content ---
    
    // Header
    document.getElementById('finish-tournament-logo').src = state.tournament ? `../../${state.tournament.logo}` : 'assets/tournament-logo.png';
    document.getElementById('finish-tournament-name').textContent = state.tournament ? `${state.tournament.name} - ${state.tournament.year}` : 'Auction Complete';
    
    // Simple Insights List
    const insightsList = document.getElementById('finish-insights-list');
    insightsList.innerHTML = `
        <li>Total Players Sold: <strong>${soldPlayers.length}</strong></li>
        <li>Total Money Spent: <strong>$${showAmount(totalSpent)}</strong></li>
    `;

    // Top 3 Buys
    const topBuysContainer = document.getElementById('finish-top-buys');
    topBuysContainer.innerHTML = ''; // Clear old cards
    
    for (const player of top3Buys) {
        const team = state.teams.find(t => t.team_id === player.team);
        const teamName = team ? team.team_name : 'N/A';
        const teamColor = team ? team.color : '#555';

        const cardHTML = `
            <div class="finish-player-card">
                <div class="card-photo">
                    <img src="${player.photo}" alt="${player.name}">
                </div>
                <div class="card-name">${player.name}</div>
                <div class="card-price">$${showAmount(player.finalPrice)}</div>
                <div class="card-team" style="background-color: ${teamColor};">
                    ${teamName}
                </div>
            </div>
        `;
        topBuysContainer.innerHTML += cardHTML;
    }
    
    // Team Logos
    const teamLogosContainer = document.getElementById('finish-team-logos');
    teamLogosContainer.innerHTML = ''; // Clear old logos
    state.teams.forEach(team => {
        teamLogosContainer.innerHTML += `<img src="${team.logo}" alt="${team.team_name}">`;
    });

    // Organizer (You can fill this in)
    // document.getElementById('finish-organizer-name').textContent = state.tournament.organizer;
    
    // **NOTE:** Make sure you have "organizer-photo.png" and "developer-photo.png"
    // in your "assets" folder, or change the src path in the HTML.

    // 3. --- Show the Modal ---
    finishScreenModal.style.display = 'flex';
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
        welcomeResumeBtn.style.display = 'flex';
        welcomeResetBtn.style.display = 'flex';

        // Logic for loading a SAVED game
        let savedData = JSON.parse(savedDataJSON);
        state = savedData.auctionState;
        history = savedData.historyData;
 
        // Add this 'if' block to support old save files
        if (!state.allPlayers) {
            state.allPlayers = state.players.slice();
        }

        

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
        welcomeStartNewBtn.style.display = 'flex';

        // Logic for starting a NEW game
        console.log("No saved state found. Starting a new auction.");
        state.players = await getPlayersData();
        state.teams = await getTeamsData();

        // Add this line to create the master list
        state.allPlayers = state.players.slice();
    }

    // This block runs for BOTH new and loaded states, ensuring UI is always in sync.
    renderUI();
    updateUndoRedoButtons(); 

    // --- ADD LISTENERS FOR THE MODAL ---
    modalCloseBtn.addEventListener('click', closeBudgetModal);

    //--- DIRECT BIDDING -------
    directBidCloseBtn.addEventListener('click', closeDirectBidModal);
    directBidForm.addEventListener('submit', handleDirectBidSubmit);

    // Use event delegation for the dynamic buttons
    budgetEditorList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName !== 'BUTTON') return;
        
        const action = target.dataset.action;
        const teamId = parseInt(target.dataset.team);
        let amount = 0;
        
        if (action === 'add') amount = 50000;
        if (action === 'subtract') amount = -50000;
        
        if (amount !== 0) {
            adjustTeamBudget(teamId, amount);
        }
    });

    // Use event delegation for the dynamic input fields
    budgetEditorList.addEventListener('change', (event) => {
        const target = event.target;
        if (target.tagName !== 'INPUT' || target.type !== 'number') return;
        
        const teamId = parseInt(target.id.split('-')[2]);
        const newValue = parseInt(target.value);
        
        setTeamBudget(teamId, newValue);
    });



    // Add Welcome Modal Listeners
    welcomeResumeBtn.addEventListener('click', closeWelcomeModal);
    welcomeStartNewBtn.addEventListener('click', closeWelcomeModal);
    welcomeResetBtn.addEventListener('click', resetAll); // Calls your existing reset function

    // Show the modal
    welcomeModal.style.display = 'flex';
     
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

    // --- LISTENERS FOR FINISH AUCTION ---
    restartUnsoldBtn.addEventListener('click', restartAuctionForUnsold);
    finishAuctionBtn.addEventListener('click', endAuction);

    // --- LISTENERS FOR FINAL SUMMARY ---
    finishModalCloseBtn.addEventListener('click', closeFinishScreen);

    //Add keyboard command for sold unsold next
    // A single, efficient listener for all keyboard shortcuts
    window.addEventListener("keydown", function(event){
        // Check if the user is currently typing in an input, select, or textarea
        const targetTag = event.target.tagName;
            if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
                return; // If so, do nothing and just let them type.
        }

        // Check for number keys 1-8 for bidding
        const keyNumber = parseInt(event.key);
        if (!isNaN(keyNumber) && keyNumber >= 1 && keyNumber <= 8) {
            bidPlayer(keyNumber + 10); // Converts key 1 to team_id 11, 2 to 12, etc.
            return; // Exit after handling the bid
        }

        // Handle other letter-based shortcuts
        switch(event.key.toLowerCase()){
            case "u":
                unsoldPlayer();
                break;
            case "s":
                soldPlayer();
                break;
            case "enter":
                nextPlayer();
                break;
            case "z":
                if(event.ctrlKey && event.shiftKey) {
                    redoChange()
                } else if (event.ctrlKey) {
                    undoChange();
                }
                break;
            case "m":
                if (event.ctrlKey) {
                    event.preventDefault(); // Stop browser's default action
                    if (budgetModal.style.display === 'none') {
                        openBudgetModal();
                    } else {
                        closeBudgetModal();
                    }
                }
                break;
            case "b":
                if (event.ctrlKey) {
                    event.preventDefault(); // Stop browser's default action
                    openDirectBidModal();
                }
                break;
            case "p":
                if (event.shiftKey) {
                    event.preventDefault();
                    window.open('squads/roster/', '_blank');
                }
                break;
        }
    });
};

// 🔷 Make sure to run when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
