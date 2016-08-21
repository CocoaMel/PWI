$(function () {

    /* static variables */
    var WARNING  = "Warning: This pack contains a large number of items. " + 
        "Since packs are opened continuously with no delay, opening a large " +
        "number of them could cause the site to become unresponsive. Please " +
        "use caution!",
        PATIENCE = "Please be patient. This could take a while!";

    /* ids */
    var mainDropdownID           = "#packList",
        mainTableID              = "#packDisplay",
        itemDropdownID           = "#packItems",
        packContentsAndChancesID = "#packContents",
        numItemsWarningID        = "#packWarning",
        numPacksToOpenID         = "#packsByNum",
        openNumPacksButtonID     = "#submitPacksByNum",
        openNumPacksStatusID     = "#packsByNumStatus",
        openPacksForItemButtonID = "#submitPacksByFilter", // not implemented
        openPacksForItemStatusID = "#packsByFilterStatus";

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
                $(mainDropdownID).append("<option name=\"" + itemData.length + 
                    "\" value=\"" + key + "\">" + key + "</option>");
            });
            $(mainDropdownID).removeClass("hidden");
            $(mainDropdownID).change(function (data) {
                var listArrayIndex = $(this).find("option:selected")
                                            .attr("name") - 1;
                if (listArrayIndex != -1) {
                    loadPackItemList(itemData[listArrayIndex]);
                }
                if ($(mainTableID).hasClass("hidden")) {
                    $(mainTableID).removeClass("hidden");
                }
            });
        }
    });

    var loadPackItemList = function (itemList) {
        $(itemDropdownID).html("<option value=\"0\" name=\"select\">Select an" +
            " Item!</option>");
        $(packContentsAndChancesID).html(function () {
            var results                 = "",
                arrayIndex              = 0;
                currentPackData.items   = [];
                currentPackData.chances = [];
            for (key in itemList) {
                currentPackData.items[arrayIndex] = key;
                currentPackData.chances[arrayIndex] = parseFloat(itemList[key]);
                results += "<tr><td id=\"" + formatID(key) + "\">0</td><td>" + 
                    key + " (" + formatPercent(itemList[key]) + ")</td></tr>";
                arrayIndex++;
                $(itemDropdownID).append("<option name=\"" + arrayIndex + 
                    "\" value=\"" + key + "\">" + key + "</option>");
            }
            $(numItemsWarningID).html("");
            if (currentPackData.items.length > 100) {
                $(numItemsWarningID).html(WARNING);
            };
            return results;
        });
    };



    /* Event Handlers */
    $(openNumPacksButtonID).on("click", function (event) {
        $(openPacksForItemStatusID).html("&nbsp;");
        var numPacksToOpen = $(numPacksToOpenID).val();
        if (numPacksToOpen === "0") {
            $(openNumPacksStatusID).html("You opened no packs and got " + 
                "nothing ):");
        } else if (numPacksToOpen === "") {
            $(openNumPacksStatusID).html("Please input a number of packs " + 
                "to open.");
        } else if (!$.isNumeric(numPacksToOpen)) {
            $(openNumPacksStatusID).html("Sorry - only numbers are accepted!");
        } else if (parseInt(numPacksToOpen) < 0 
            || (Math.ceil(parseInt(numPacksToOpen)) === 0 
            && Math.ceil(numPacksToOpen) === 0)) {
            /*
             This checks if the input is negative OR if input is between -1 and 
             0. Numbers between -1 and 0 would not be caught under negative
             because parseInt will return 0. Just including 
             parseInt(numPacksToOpen) < 0 and 
             Math.ceil(parseInt(numPacksToOpen)) === 0) means that in the event 
             that the user enters a number between 0 (exclusive) and 1 
             (exclusive), this block will be triggered, which we don't want. 
             It will be triggered because parseInt will return 0. Adding 
             Math.ceil(numPacksToOpen) === 0 will prevent this because in the 
             event of a number between 0 and 1 (exlusive), the number will be 
             rounded up to 1. As a result, this block would be ignored in favor 
             of the last else case!
            */
            $(openNumPacksStatusID).html("Sorry - only positive numbers are " + 
                "accepted!");
        } else {
            console.log(parseInt(numPacksToOpen).toString());
            numPacksToOpen = Math.ceil(numPacksToOpen);
            $(openNumPacksStatusID).html("Opening " + numPacksToOpen + 
                makePluralIfNeeded(" pack", numPacksToOpen) + "... " + 
                ((parseInt(numPacksToOpen) >= 1000000) ? PATIENCE : ""));

            // run function on a delay because the above HTML won't update without it
            window.setTimeout(function () {
                var packItems        = currentPackData.items,
                    numItemsInPack   = packItems.length,
                    numItemsObtained = new Array(numItemsInPack).fill(0),
                    item,
                    itemIndex;

                for (var i = 0; i < numPacksToOpen; i++) {
                    item = getRandomItemFromListByWeight(currentPackData);
                    itemIndex = packItems.indexOf(item);
                    numItemsObtained[itemIndex]++;
                };

                var hasPatienceMessage = 
                    $(openNumPacksStatusID).html().includes("... P");
                if (hasPatienceMessage) {
                    $(openNumPacksStatusID).html(function () {
                        var stopIndex = 
                            $(openNumPacksStatusID).html().indexOf("... P") + 4;
                        return $(openNumPacksStatusID).html()
                                                      .substring(0, stopIndex);
                    });
                };

                writeResultsToTable(numItemsObtained);
                $(openNumPacksStatusID).append("Done!");
            }, 50);
        } 
    });

    $("#submitPacksByFilter").on("click", function (event) {
        var targetItem = $(itemDropdownID).find("option:selected").val();
        var targetNum = $("#packsByFilterAddNum").val();
        if (targetNum === "") {
            targetNum = 1;
        }
        $(openNumPacksStatusID).html("&nbsp;");
        if (targetItem === "0") {
            $(openPacksForItemStatusID).html("Please select an item!");
        } else if (targetNum === "0") {
            $(openPacksForItemStatusID).html("You opened 0 packs and got 0 " + 
                targetItem + ". Congrats!");
        } else if (!$.isNumeric(targetNum)) {
            $(openPacksForItemStatusID).html("Sorry - only numbers are accepted!");
        } else if (parseInt(targetNum) < 0 
            || (Math.ceil(parseInt(targetNum)) === 0 
            && Math.ceil(targetNum) === 0)) {
            /*
             This checks if the input is negative OR if input is between -1 and 
             0. Numbers between -1 and 0 would not be caught under negative
             because parseInt will return 0. Just including 
             parseInt(numPacksToOpen) < 0 and 
             Math.ceil(parseInt(numPacksToOpen)) === 0) means that in the event 
             that the user enters a number between 0 (exclusive) and 1 
             (exclusive), this block will be triggered, which we don't want. 
             It will be triggered because parseInt will return 0. Adding 
             Math.ceil(numPacksToOpen) === 0 will prevent this because in the 
             event of a number between 0 and 1 (exlusive), the number will be 
             rounded up to 1. As a result, this block would be ignored in favor 
             of the last else case!
            */
            $(openPacksForItemStatusID).html("Sorry - only positive numbers are " + 
                "accepted!");
        } else {
            targetNum = Math.ceil(targetNum);
            $(openPacksForItemStatusID).html("Opening packs until " + targetNum + " " + 
                targetItem + " obtained... " + 
                ((targetNum >= 999) ? "Please be patient. This could take a while! " : ""));

            // run function on a delay because the above HTML won't update without it
            window.setTimeout(function () {
                var numItemsObtained = new Array(currentPackData.items.length).fill(0);
                var item;
                var itemIndex;
                var numGotten = 0;
                var numTries = 0;

                do {
                    item = getRandomItemFromListByWeight(currentPackData);
                    itemIndex = currentPackData.items.indexOf(item);
                    numItemsObtained[itemIndex]++;
                    numTries++;
                    if (item === targetItem) {
                        numGotten++;
                    }
                } while (numGotten < targetNum) 

                writeResultsToTable(numItemsObtained);

                if ($(openPacksForItemStatusID).html().includes("... P")) {
                    $(openPacksForItemStatusID).html(function () {
                        var stopIndex = $(openPacksForItemStatusID).html().indexOf("... P") + 4;
                        return $(openPacksForItemStatusID).html().substring(0, stopIndex);
                    })
                }

                $(openPacksForItemStatusID).append("Done! It took " + numTries + " packs.");
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
            weightSum = +weightSum.toFixed(6);

            if (randomNum <= weightSum) {
                return list[i];
            }
        }
    }

    var formatPercent = function (num) {
        var formattedNum = removeTrailingZeroes((num * 100).toFixed(6)).toString() + "%";
        if (formattedNum.includes(".%")) {
            var periodIndex = formattedNum.indexOf(".");
            formattedNum = formattedNum.substring(0, periodIndex + 1) + 
                "0" + formattedNum.substring(periodIndex + 1, formattedNum.length);
        }
        return formattedNum;
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

    var makePluralIfNeeded = function (word, num) {
        return word + ((parseInt(num) === 1) ? "" : "s");
    }

});