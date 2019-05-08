/***********************************************
 * Project: Rock-Paper-Scissors
 * Developer: Sean Bryan
 * Date: 2019-05-04
 ***********************************************/

$(document).ready(function () {
    // Global Variables
    var databaseReady = false;
    var battleIntervalId;
    var battleCountdown = 3;

    var config = {
        apiKey: "AIzaSyAp3Qe_0i-NO1NUHSObvPWoFtsCJ6K49KM",
        authDomain: "rock-paper-scissors-f1c46.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-f1c46.firebaseio.com",
        projectId: "rock-paper-scissors-f1c46",
        storageBucket: "rock-paper-scissors-f1c46.appspot.com",
        messagingSenderId: "713282943627",
        appId: "1:713282943627:web:df89ce23995580b7"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Initial Values
    var player1Selection = "";
    var player1Victories = 0;
    var player2Selection = "";
    var player2Victories = 0;
    var ties = 0;
    var finalWinner = "";
    var userSelection = "";
    var playerComments = "";

    /**
     * Time to fight.  Opponents displayed and a timer initiated
     */
    function startBattle() {
        $("#card-timer").show();
        $("#battle-timer").html("<h4>" + "Battle in: 3" + "</h2>");
        displaySelection("player1", player1Selection);
        displaySelection("player2", player2Selection);
        battleCountdown = 3;
        battleIntervalId = setInterval(battleTimer, 1000);
    }

    /**
     * Display a countdown that, at zero, starts the battle action, displays
     * results, and trasitions to next round
     */
    function battleTimer() {
        battleCountdown--;
        $("#battle-timer").html("<h4>" + "Battle in: " + battleCountdown + "</h4>");

        if (battleCountdown === 0) {
            stopBattleTimer();
            $("#card-timer").hide();
            var winner = determineWinner();
            updateWinCountAndResetSelection(winner);
            displayResults(winner);
            transitionToNextRound();
        }
    }

    /**
     * Pause for 3 seconds, evaluate final winner status, and proceed to next stage
     */
    function transitionToNextRound() {
        setTimeout(function () {
            transitionDelay();
        }, 3000);

        if(player1Victories > 2) {
            finalWinner = "Player 1";
        }

        if(player2Victories > 2) {
            finalWinner = "Player 2";
        } 
    }

    /**
     * Action that occurs following a delay
     */
    function transitionDelay() {
        $(".player1-status").empty();
        $(".player1-waiting").empty();
        $(".player2-status").empty();
        $(".player2-waiting").empty();

        if(finalWinner) {
            displayVictoryCircle(finalWinner);
        }
        else {
            displayBattleOptions(userSelection);
        }
    }

    /**
     * Stops the battle timer
     */
    function stopBattleTimer() {
        clearInterval(battleIntervalId);  //stops the interval
    }

    /**
     * Logic that determines a winner (or tie) based on the selected values
     */
    function determineWinner() {
        var winnerPlayer1 = false;
        if (player1Selection !== player2Selection) {
            if (player1Selection === "rock" && player2Selection === "scissors") {
                winnerPlayer1 = true;
            }
            if (player1Selection === "paper" && player2Selection === "rock") {
                winnerPlayer1 = true;
            }
            if (player1Selection === "scissors" && player2Selection === "paper") {
                winnerPlayer1 = true;
            }

            if (winnerPlayer1) {
                return ("player1");
            }
            else {
                return ("player2");
            }
        }
        else {
            return "tie";
        }
    }

    /**
     * Creates display for player one and an initial data base entry
     */
    function readyPlayer1() {
        userSelection = "player1";
        displayPlayerReadyButtons(false);
        displayBattleOptions(userSelection);

        var player1 = database.ref("/player1");
        player1.update({
            "selection": player1Selection,
            "victories": player1Victories,
            "ties": ties
        });

        databaseReady = true;
    }

    /**
     * Creates display for player two and an initial data base entry
     */
    function readyPlayer2() {
        userSelection = "player2";
        displayPlayerReadyButtons(false);
        displayBattleOptions(userSelection);

        var player2 = database.ref("/player2");
        player2.update({
            "selection": player2Selection,
            "victories": player2Victories,
            "ties": ties
        });

        databaseReady = true;
    }

    /**
     * Re-set the game
     */
    function playAgain() {
        initializeFields();
        $(".victory-circle").empty();
        displayPlayerReadyButtons(true);
        database.ref().remove(); 
    }

    /**
     * Initialize values to start a new game
     */
    function initializeFields() {
        player1Selection = "";
        player1Victories = 0;
        player2Selection = "";
        player2Victories = 0;
        ties = 0;
        finalWinner = "";
        userSelection = "";
        playerComments = "";
    }

    /**
     * Updates the selection field in the data base
     */
    function saveSelection() {
        event.preventDefault();

        var selection = $(this).attr("data-selection");
        var player = $(this).attr("data-player");

        if (player === "player1") {
            var player1 = database.ref("/player1");
            player1.update({
                "selection": selection
            });
            $(".player1-select").empty();
        }
        else {
            var player2 = database.ref("/player2");
            player2.update({
                "selection": selection
            });
            $(".player2-select").empty();
        }
    }

    /**
     * Query the table for win count, update according to latest win,
     * and reset the player selections
     * @param player 
     */
    function updateWinCountAndResetSelection(player) {
        database.ref().once("value", function (snapshot) {
            var player1WinCount = snapshot.val().player1.victories;
            var player2WinCount = snapshot.val().player2.victories;
            if (player == "player1") {
                player1WinCount++;
            }
            else if (player == "player2") {
                player2WinCount++;
            }

            snapshot.ref.update({
                "player1/victories": player1WinCount,
                "player2/victories": player2WinCount,
                "player1/selection": "",
                "player2/selection": ""
            });
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    /**
     * Display an image indicating that you are waiting for input from your opponent
     * @param playerNumber 
     */
    function displayWaitingStatus(playerNumber) {
        var imageDiv = $("<div>");
        imageDiv.addClass("waiting-container rounded");
        var image = $("<img>");
        image.addClass("waiting-image");
        image.attr("src", "./assets/images/shieldwall" + playerNumber + ".jpg");
        image.attr("alt", "Shieldwall");
        var banner = $("<p>");
        banner.addClass("image-banner");
        banner.text("Awaiting Thy Opponent...")
        imageDiv.append(image);
        imageDiv.append(banner);
        $(".player" + playerNumber + "-waiting").append(imageDiv);
    }

    /**
     * Orchestrates the display of the rock, paper, scissors options
     * @param player 
     */
    function displayBattleOptions(player) {
        var rock = createBattleElement(player, "rock", "rps-image");
        var paper = createBattleElement(player, "paper", "rps-image");
        var scissors = createBattleElement(player, "scissors", "rps-image");

        $("." + player + "-select").append(rock);
        $("." + player + "-select").append(paper);
        $("." + player + "-select").append(scissors);
    }

    function displayVictoryCircle(victor) {
        $(".victory-circle").show();
        var jumbotron = $("<div>");
        jumbotron.addClass("jumbotron");
        var header = $("<h1>");
        header.addClass("display-4");
        header.attr("id", "victory-header");
        header.text("SUPREME CONQUERER");
        var victorElement = $("<h2>");
        victorElement.text(victor);
        var button = $("<button>");
        button.attr("type","submit");
        button.addClass("btn btn-primary play-again-button");
        button.text("RE-ENTER THE ARENA");
        jumbotron.append(header);
        jumbotron.append(victorElement);
        jumbotron.append(button);           
        $(".victory-circle").append(jumbotron);
    }

    function displaySelection(player, selection) {
        $("." + player + "-select").empty();
        var selection = createBattleElement(player, selection, "selected-image");
        $("." + player + "-waiting").append(selection);
    }

    function displayNumberofWins(player, winCount) {
        $("#" + player + "-wins").html("<h2>" + "Victories: " + winCount + "</h2>");
    }

    /**
     * Creates the elements to display to rock, paper, or scissors icon
     * @param player 
     * @param selection 
     */
    function createBattleElement(player, selection, imgClass) {
        var imageContainer = $("<div>");
        imageContainer.addClass("image-container");
        imageContainer.addClass("text-center");
        var image = $("<img>");
        image.addClass(imgClass);
        image.attr("data-selection", selection);
        image.attr("data-player", player);
        if (player === "player1") {
            image.attr("src", "./assets/images/" + selection + "1.jpg");
        }
        else {
            image.attr("src", "./assets/images/" + selection + "2.jpg");
        }
        image.attr("alt", selection);
        var imageBanner = $("<p>");
        imageBanner.addClass("rps-banner");
        imageBanner.text(selection.toUpperCase());

        imageContainer.append(image);
        imageContainer.append(imageBanner);

        return imageContainer;
    }

    /**
     * Toggles the display of the "Ready Player" buttons
     * @param displayButtons 
     */
    function displayPlayerReadyButtons(displayButtons) {
        if (displayButtons) {
            $("#ready-player1").show();
            $("#ready-player2").show();
        }
        else {
            $("#ready-player1").hide();
            $("#ready-player2").hide();
        }
    }

    /**
     * Display the results of the round
     * @param winner 
     */
    function displayResults(winner) {
        var win = $("<h3>").text("HEROIC VICTOR!");
        var lose = $("<h3>").text("VANQUISHED CHURL!");
        var tie1 = $("<h3>").text("STALEMATE...");
        var tie2 = $("<h3>").text("STALEMATE...");
        if(winner === "player1") {
            $(".player1-status").append(win);
            $(".player2-status").append(lose);
        }
        else if (winner === "player2") {
            $(".player2-status").append(win);
            $(".player1-status").append(lose);
        }
        else {
            $(".player1-status").append(tie1);
            $(".player2-status").append(tie2);
        }
    }

    /**
     * Listens for changes to the values on the data base
     */
    database.ref().on("value", function (snapshot) {
        if (snapshot.val().player1) {
            $("#ready-player1").hide();
            if (databaseReady) {
                player1Selection = snapshot.val().player1.selection;
                player1Victories = snapshot.val().player1.victories;
            }
            displayNumberofWins("player1", player1Victories);
        }

        if (snapshot.val().player2) {
            $("#ready-player2").hide();
            if (databaseReady) {
                player2Selection = snapshot.val().player2.selection;
                player2Victories = snapshot.val().player2.victories;
            }
            displayNumberofWins("player2", player2Victories);
        }

        if (player1Selection && !player2Selection) {
            console.log("2: " + $('.player2-select').text().trim().length);
            if ($('.player2-select').text().trim().length == 0 ) {
                displayWaitingStatus("2");
            }
        }

        if (player2Selection && !player1Selection) {
            console.log("1: " + $('.player1-select').text().trim().length);
            if ( $('.player1-select').text().trim().length == 0 ) {
                displayWaitingStatus("1");
            }
        }

        if (player1Selection && player2Selection) {
            $(".player1-waiting").empty();
            $(".player2-waiting").empty();
            startBattle();
        }

        //database.ref().remove();  //don't delete
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    /** On-Click for Ready Player 1 */
    $(document).on("click", "#ready-player1", readyPlayer1);

    /** On-Click for Ready Player 2 */
    $(document).on("click", "#ready-player2", readyPlayer2);

    /** On-Click for image select */
    $(document).on("click", ".rps-image", saveSelection);

    /** On-Click for Play Again */
    $(document).on("click", ".play-again-button", playAgain);

    $(".victory-circle").hide();
    $("#card-timer").hide();
});