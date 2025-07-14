const handlers = []; // save references here [it will use to remove event listener of the teams]
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

//Get the player data as array of objects from the players.json file
const getPlayersData = async () => {
     const response = await fetch("data/players.json");
     players_initial = await response.json();
};
//Get teams data
const getTeamsData = async () => {
     const response = await fetch("data/teams.json");
     teams_initial = await response.json();
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
    currentBidAmount.innerText = "00K";
    currentBidTeam.innerText = "NO BIDS";

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
    
    state.players[state.auctionCount].bids.push({ team: team_id, amount: bidAmount }); //Add bid to the state.players original object object
    console.log(`${state.players[state.auctionCount].name} is bidded by ${state.teams[teamIndex].team_name}`);

    //Update the UI
    currentBidAmount.innerText = showAmount(bidAmount);
    currentBidTeam.innerText = state.teams[teamIndex].team_name;
    document.querySelector(".current-bid-team").style.backgroundColor = state.teams[teamIndex].color;

    //Show SOLD button instead of UNSOLD button
    unsoldButton.style.display = "none";
    soldButton.style.display = "inline";

}

function unsoldPlayer() {
    //Prevent player to unsold after a bid is placed
    if(state.players[state.auctionCount].bids.length > 0){
        console.log("A player can't be unsold because atleast one bid is placed.");
        return;
    }

    state.unsoldPlayers.push(state.players[state.auctionCount].id);   //Take the player id in the state.unsoldPlayers list
    state.players[state.auctionCount].status = "unsold";       // change the player status to unsold

    state.unsoldCount++;             //Increamented the unsold count

    console.log(`${state.players[state.auctionCount].name} remains unsold.`)

    unsoldButton.style.display = "none";        //hide the UNSOLD button
    nextButton.style.display = "block";         //Show the NEXT button

    unsoldSeal.style.display = "block"; //Show the unsold seal
}

function soldPlayer() {
    //prevent player to be sold until a bid is placed
    if(state.players[state.auctionCount].bids.length === 0){
        console.log("Can't sold this player because no bid is placed");
        return;
    }

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
    state.teams[teamIndex].remaining_budget -= lastBid.amount;        //Update teams' remaining budget
    state.teams[teamIndex].total_cost += lastBid.amount;        //Update teams' total cost

    console.log(`${player.name} is sold to ${state.teams[teamIndex].team_name}`);

    //Update the UI with updated team data
    showTeamData(lastBid.team);

    //Show the SOLD seal
    soldSeal.style.display = "block";

    //Show NEXT Button instead of SOLD Button
    soldButton.style.display = "none";        //hide the SOLD button
    nextButton.style.display = "block";         //Show the NEXT button
}

function nextPlayer() {
    state.auctionCount++;        //Increase the auction count

    //Show next players' data in the UI
    showPlayerDetails(state.auctionCount);

    console.log(`${state.players[state.auctionCount].name}'s data loaded`);

    //Hide NEXT button and Show UNSOLD Button
    nextButton.style.display = "none";
    unsoldButton.style.display = "block";

    //Hide All Seals
    unsoldSeal.style.display = "none"; //Hide the unsold seal
    soldSeal.style.display = "none"; //Hide the sold seal
}

function skipPlayer() {
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
}


// Main App Logic
const initApp = async () => {
    await getPlayersData(); // wait for the JSON
    await getTeamsData();

    state.players = players_initial;
    state.teams = teams_initial;


    //Initialize team data in the UI
    for(let i = 0; i < state.teams.length; i++){
        showTeamData(state.teams[i].team_id);
    }


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





     
    //show the first player data
    showPlayerDetails(0);       //First object of the players array

    //Click event for Buttons
    unsoldButton.addEventListener("click", () => unsoldPlayer());
    nextButton.addEventListener("click", () => nextPlayer());
    soldButton.addEventListener("click", () => soldPlayer());
    skipButton.addEventListener("click", () => skipPlayer());

};

// 🔷 Make sure to run when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
