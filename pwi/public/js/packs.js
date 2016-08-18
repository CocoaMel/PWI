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
                results += "<tr><td id=\"" + formatID(key) + "\"><td>" + 
                    key + " (" + formatPercent(itemList[key]) + "%)</td></tr>";
                arrayIndex++;
            }
            if (arrayIndex % 3 != 2) {
                results += "</tr>"
            }
            return results;
        });
    };

    var formatPercent = function (num) {
        return removeTrailingZeroes((num * 100).toFixed(4));
    };

    var formatID = function (unformattedString) {
        return unformattedString.replace(/\W/g,'').toLowerCase();
    };

    var removeTrailingZeroes = function (num) {
        return num.replace(/(\.[0-9]*?)0+$/, "$1");
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
    

    /* Helper Functions */
    /*var writeNumbersToTable = function (results) {
        var currentItemName = "";
        for (var i = 0; i < results.length; i++) {
            currentItemName = currentPackData.items[i].replace(/\W/g,'').toLowerCase();
            $("#" + currentItemName).html(results[i]);
        }
    };


    var getRandomNum = function (min, max) {
        return Math.random() * (max - min) + min;
    }

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
    }*/

});