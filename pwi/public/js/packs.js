$(function () {

    console.log("Hello Packs!");

    /* Setup */
    var currentPackData = {
        items: [],
        chances: []
    };

    var loadPacks = $.ajax({
        url: "../files/packs.json",
        jsonp: "callback",
        datatype: "jsonp", 
        success: function (data) {
            var itemData = [];
            $.each (data, function (key, val) {
                itemData.push(val);
                $("#packList").append("<option name=\"" + itemData.length + 
                    "\" value=\"" + key + "\">" + key + " </option>");
            });
            $("#packList").removeClass("hidden")
            $("#packList").change(function (data) {
                var listArrayIndex = $(this).find("option:selected").attr("name") - 1;
                if (listArrayIndex != -1) {
                    loadPackItemList(itemData[listArrayIndex]);
                }
                if ( $("#packDisplay").hasClass("hidden") ) {
                    $("#packDisplay").removeClass("hidden");
                }
            });
        }
    });

    var loadPackItemList = function (itemList) {
        $("#packContents").html(function (data) {
            var results = "",
                arrayIndex = 0;
            currentPackData.items = [];
            currentPackData.chances = [];
            for (key in itemList) {
                currentPackData.items[arrayIndex] = key;
                currentPackData.chances[arrayIndex] = parseFloat(itemList[key]);
                results += "<tr><td id=\"" + formatID(key) + "\">0</td><td>" + 
                    key + " (" + formatPercent(itemList[key]) + "%)</td></tr>";
                arrayIndex++;
            }
            if (arrayIndex % 3 != 2) {
                results += "</tr>"
            }
            return results;
        });
    };

    /* Event Handlers */
    $("#submitPacksByNum").on("click", function (event) {
        var numPacksToOpen = $("#packsByNum").val();
        if (numPacksToOpen === "0") {
            $("#packsByNumStatus").html("You opened no packs and got nothing ):")
        } else if (numPacksToOpen === "") {
            $("#packsByNumStatus").html("Please input a number of packs to open.");
        } else if (!$.isNumeric(numPacksToOpen)) {
            $("#packsByNumStatus").html("Sorry - only numbers are accepted!");
        } else {
            $("#packsByNumStatus").html("Opening " + numPacksToOpen + " pack" + 
                ((numPacksToOpen === "1") ? "" : "s") + "... " );

            // run function on a delay because the above HTML won't update without it
            window.setTimeout(function () {
                var numItemsObtained = new Array(currentPackData.items.length).fill(0);
                var item;
                var itemIndex;

                for (var i = 0; i < numPacksToOpen; i++) {
                    item = getRandomItemFromListByWeight(currentPackData);
                    itemIndex = currentPackData.items.indexOf(item);
                    numItemsObtained[itemIndex]++;
                };

                writeResultsToTable(numItemsObtained);
                $("#packsByNumStatus").append("Done!");
            }, 50);
        } 
    });


    /* Helper Functions */
    /*var writeOneResultToTable = function (itemName) {
        var itemID = formatID(itemName);
        $("#" + currentItemID).html(function () {
            return $(this).html() + 1;
        });
    }*/

    var writeResultsToTable = function (results) {
        var currentItemID = "";
        for (var i = 0; i < results.length; i++) {
            currentItemID = formatID(currentPackData.items[i]);
            $("#" + currentItemID).html(results[i]);
        }
    };

    // Thanks to 
    // http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
    var getRandomItemFromListByWeight = function (packData) {
        var chances = packData.chances;
        var list = packData.items;
        var totalWeight = chances.reduce(function (prev, cur) {
            return prev + cur;
        });

        var randomNum = getRandomNum(0, totalWeight);
        var weightSum = 0;

        for (var i = 0; i < list.length; i++) {
            weightSum += chances[i];
            weightSum = +weightSum.toFixed(4);

            if (randomNum <= weightSum) {
                return list[i];
            }
        }
    }

    var formatPercent = function (num) {
        return removeTrailingZeroes((num * 100).toFixed(4));
    };

    var formatID = function (unformattedString) {
        return unformattedString.replace(/\W/g,'').toLowerCase();
    };

    var removeTrailingZeroes = function (num) {
        return num.replace(/(\.[0-9]*?)0+$/, "$1");
    };

    var getRandomNum = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    /* Event Handlers */
    /*$("#submit").on("click", function (event) {
        if ($.isNumeric( $("#num").val()) ) {

            var numTimesToTest = $("#num").val();
            var numTimesYouGotTheCrap = new Array(currentPackData.items.length).fill(0);
            var item;
            var itemIndex;

            for (var i = 0; i < numTimesToTest; i++) {
                item = getRandomItemFromListByWeight(currentPackData);
                itemIndex = currentPackData.items.indexOf(item);
                numTimesYouGotTheCrap[itemIndex]++;
            };

            writeNumbersToTable(numTimesYouGotTheCrap);
        } 
    });

    $("#submitItem").on("click", function() {
        if (currentPackData.items.indexOf( $("#item").val()) != -1 ) {

            var targetItem = $("#item").val();
            var numTimesYouGotTheCrap = new Array(currentPackData.items.length).fill(0);
            var numTries = 0;
            var item;
            var itemIndex;
            var numWanted;
            var numGotten = 0;

            if ($("#numOfItem").val() === "" || !$.isNumeric($("#numOfItem").val())) {
                numWanted = 1;
            } else {
                numWanted = $("#numOfItem").val();
            }

            do {
                item = getRandomItemFromListByWeight(currentPackData);
                itemIndex = currentPackData.items.indexOf(item);
                numTimesYouGotTheCrap[itemIndex]++;
                numTries++;
                if (targetItem === item) {
                    numGotten++;
                }
            } while (numGotten < numWanted);

            $("#itemResults").html("Number of Packs Opened to Receive " + numWanted + " " +
                targetItem + ": " + numTries);

            writeNumbersToTable(numTimesYouGotTheCrap);

        } else {
            console.log(":O");
        }
    })*/
    

    

});