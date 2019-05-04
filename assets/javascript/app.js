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

    function saveSelection() {
        var type = $(this).attr("data-type");
        var player = $(this).attr("data-player");
        alert(type);
        alert(player);
    }

    function displayBattleOptions(player) {
        var rock = createBattleElement(player, "rock");
        var paper = createBattleElement(player, "paper");
        var scissors = createBattleElement(player, "scissors");

        $("." + player + "-select").append(rock);
        $("." + player + "-select").append(paper);
        $("." + player + "-select").append(scissors);
    }

    function createBattleElement(player, type) {
        var imageContainer = $("<div>");
        imageContainer.addClass("image-container");
        imageContainer.addClass("text-center");
        var image = $("<img>");
        image.addClass("rps-image");
        image.attr("data-type", type);
        image.attr("data-player", player);
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