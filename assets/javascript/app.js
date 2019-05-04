/***********************************************
 * Project: Rock-Paper-Scissors
 * Developer: Sean Bryan
 * Date: 2019-05-04
 ***********************************************/

$(document).ready(function () {
    // Global Variables

    function readyPlayer1() {
        displayPlayerReadyButtons(false);
        displayBattleOptions("player1");
    }

    function readyPlayer2() {
        displayPlayerReadyButtons(false);
        displayBattleOptions("player2");
    }

    function displayBattleOptions(player) {
        var rock = createBattleElement(player, "rock");
        var paper = createBattleElement(player, "paper");
        var scissors = createBattleElement(player, "scissors");

        $("#" + player + "-wrapper").append(rock);
        $("#" + player + "-wrapper").append(paper);
        $("#" + player + "-wrapper").append(scissors);
    }

    function createBattleElement(player, type) {
        var columnElement = $("<div>");
        columnElement.addClass("col-sm-12");
        var imageContainer = $("<div>");
        imageContainer.addClass("image-container");
        imageContainer.addClass("text-center");
        var image = $("<img>");
        image.addClass("rps-image");
        image.attr("data-name", type);
        if (player === "player1") {
            image.attr("src","./assets/images/" + type + "1.jpg");
        }
        else {
            image.attr("src","./assets/images/" + type + "2.jpg");
        }
        image.attr("alt",type);
        var imageBanner = $("<p>");
        imageBanner.addClass("image-banner");
        imageBanner.text(type.toUpperCase());

        imageContainer.append(image);
        imageContainer.append(imageBanner);
        columnElement.append(imageContainer);

        return columnElement;
    }

//     <div class="col-sm-12">
//     <div class="image-container">
//         <img class="rock-image rps-image" src="./assets/images/rock1.jpg" alt="Player 1 Rock">
//         <p class="image-banner">Rock</p>
//     </div>
// </div>

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

    // $(".show-favorite-button").hide();
    // renderButtons();
});