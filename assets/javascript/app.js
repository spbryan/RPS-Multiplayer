/***********************************************
 * Project: Rock-Paper-Scissors
 * Developer: Sean Bryan
 * Date: 2019-05-04
 ***********************************************/

$(document).ready(function () {
    // Global Variables

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
    var player = "";
    var selection = "";
    var player1Selection = "";
    var player1Victories = 0;
    var player2Selection = "";
    var player2Victories = 0;
    var ties = 0;
    var playerComments = "";


    function readyPlayer1() {
        displayPlayerReadyButtons(false);
        displayBattleOptions("player1");
    }

    function readyPlayer2() {
        displayPlayerReadyButtons(false);
        displayBattleOptions("player2");
    }

    function saveSelection() {
        event.preventDefault();

        var selection = $(this).attr("data-selection");
        var player = $(this).attr("data-player");

        // console.log(selection);
        // console.log(player);

        database.ref().push({
            player,
            selection
        });

        //Using set
        // if(player === "player1") {
        //     database.ref().set({
        //         player1Selection: selection
        //     });
        // }
        // else {
        //     database.ref().set({
        //         player2Selection: selection
        //     });
        // }
    }

    database.ref().on("value", function (snapshot) {
        var player1Selection = "";
        var player2Selection = "";

        console.log(snapshot.val());

        snapshot.forEach(function (child) {
            // console.log(child.key + ": " + child.val());
            var player = child.val().player;
            var selection = child.val().selection;
            if (player && selection) {
                if (player === "player1") {
                    player1Selection = selection;
                }
                else {
                    player2Selection = selection;
                }
            }

            if (player1Selection && player2Selection) {
                alert("Both selected");
                database.ref().remove();              
            }
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    function displayBattleOptions(player) {
        var rock = createBattleElement(player, "rock");
        var paper = createBattleElement(player, "paper");
        var scissors = createBattleElement(player, "scissors");

        $("." + player + "-select").append(rock);
        $("." + player + "-select").append(paper);
        $("." + player + "-select").append(scissors);
    }

    function createBattleElement(player, selection) {
        var imageContainer = $("<div>");
        imageContainer.addClass("image-container");
        imageContainer.addClass("text-center");
        var image = $("<img>");
        image.addClass("rps-image");
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
        imageBanner.addClass("image-banner");
        imageBanner.text(selection.toUpperCase());

        imageContainer.append(image);
        imageContainer.append(imageBanner);

        return imageContainer;
    }

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

    /** On-Click for Ready Player 1 */
    $(document).on("click", "#ready-player1", readyPlayer1);

    /** On-Click for Ready Player 2 */
    $(document).on("click", "#ready-player2", readyPlayer2);

    /** On-Click for image select */
    $(document).on("click", ".rps-image", saveSelection);

    // $(".show-favorite-button").hide();
    // renderButtons();

});