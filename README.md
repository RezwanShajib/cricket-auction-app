# Auction Desk: A Dynamic Cricket Auction App

A fully-featured, serverless cricket auction application built with vanilla HTML, CSS, and JavaScript. This app provides a complete auction experience with data persistence, a full undo/redo system, and detailed reporting.

<img width="1919" height="1079" alt="Screenshot 2025-07-20 054938" src="https://github.com/user-attachments/assets/29c703d6-fef0-41c7-bd6f-30b8c0b9038d" />


-----

## ✨ Features

  - **Dynamic Data:** Loads all player, team, and tournament data from local JSON files.
  - **Full Bidding System:** Teams can bid on players, with logic to prevent invalid bids (insufficient funds, consecutive bids).
  - **State Persistence:** The entire auction state is automatically saved to the browser's `localStorage` after every action, allowing users to resume an auction exactly where they left off, even after closing the browser.
  - **Multi-Level Undo/Redo:** A robust history system that captures every bid and action, allowing the user to step backward and forward through the auction history.
  - **Detailed Squad View:** Users can view a detailed breakdown of each team's roster, finances, and players grouped by role on a separate, dynamic page.
  - **Printable Team Sheets:** Generate a professional, A4-formatted team sheet for any team, ready to be printed or saved as a PDF.
  - **Keyboard Shortcuts:** A full suite of keyboard shortcuts for bidding and auction controls to improve usability.

-----

## 🛠️ Tech Stack

  - **HTML5**
  - **CSS3** (with CSS Grid and Flexbox for layout)
  - **Vanilla JavaScript (ES6+)** (with asynchronous operations)

-----

## 🚀 Getting Started

This is a serverless application and requires no build steps.

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3.  Open the `index.html` file in your web browser. For the best experience and to ensure the `fetch` API works correctly, it's recommended to use a local server. A simple way is to use the **Live Server** extension in Visual Studio Code.

-----

## 📖 How to Use

### Bidding

  - Click on any team card on the right to place a bid for the current player.
  - Alternatively, use the number keys **1** through **8** on your keyboard to bid for the corresponding team.

### Auction Controls

The auctioneer can control the flow using the buttons at the bottom or the corresponding keyboard shortcuts:

| Action | Button | Shortcut |
| :--- | :--- | :--- |
| Sell Player | **SOLD** | `S` |
| Mark Unsold | **UNSOLD** | `U` |
| Next Player | **NEXT** | `Enter` |
| Skip Player | **SKIP** | *(No shortcut)* |

### Viewing Squads & Printing

  - **View Squads:** Hold the **Ctrl** key (or **Shift** key) and click on any team card on the auction page. This will open a new tab showing that team's detailed roster.
  - **Print Team Sheet:** From the detailed squad page, click the "Print Team Sheet" button to generate a print-ready document.

<img width="1918" height="1079" alt="Screenshot 2025-07-20 054754" src="https://github.com/user-attachments/assets/cce3e4fb-8044-4bf1-a4c8-3f4034a29121" />


### Undo/Redo

  - Use the **Undo** and **Redo** buttons to step backward or forward through every action.
  - Keyboard shortcuts: **Ctrl + Z** for Undo and **Ctrl + Shift + Z** for Redo.

### Resetting the Auction

  - The **Reset** button will clear all saved data from `localStorage` and reload the page to start a fresh auction from the beginning.

-----

## 📂 Project Structure

```
/
├── index.html                  # Main auction page
├── app.js                      # Core logic for the auction
├── styles.css                  # Styles for the main page
│
├── data/
│   ├── players.json
│   ├── teams.json
│   └── tournament.json
│
├── squads/
│   ├── index.html              # Detailed squad list page
│   ├── script.js               # Logic for the squad list page
│   ├── styles.css              # Styles for the squad list page
|   ├── teamsheet
│       ├── teamsheet.html      # Printable team sheet template
│       ├── teamsheet.js        # Logic for the team sheet
│       └── teamsheet.css       # Print styles for the team sheet
│
└── assets/
    ├── players-photo/
    ├── teams-logo/
    └── tournament-logo.png
```

-----

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
