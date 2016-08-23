$(function () {

    /* static variables */
    var WARNING  = "Warning: This pack contains a large number of items. " + 
        "Since packs are opened continuously with no delay, opening a large " +
        "number of them could cause the site to become unresponsive. Please " +
        "use caution!",
        WARNING_PACK_LENGTH = 100,
        PATIENCE = "Please be patient. This could take a while!",
        PATIENCE_OPEN_NUM = 1000000,
        PATIENCE_ITEM_NUM = 999,
        PERIODS_OFFSET = 4,
        REMOVE_BTN = "<input type=\"button\" class=\"packRemove\" value=\"-\">";

    /* ids */
    var mainDropdownID        = "#packList",
        mainTableID           = "#packDisplay",
        itemDropdownID        = ".packItems",
        packContentsTableID   = "#packContents",
        numItemsWarningID     = "#packWarning",
        numPacksToOpenID      = "#packsByNum",
        openNumPacksBtnID     = "#submitPacksByNum",
        openNumPacksStatusID  = "#packsByNumStatus",
        openForItemBtnID      = "#submitPacksByFilter", 
        openForItemStatusID   = "#packsByItemStatus",
        openPacksForItemAmtID = "#packsByItemNum",
        addItemToFilterID     = "#packItemOptions",
        addItemToFilterBtnID  = "#addItemByFilter",
        addNumToFilterID      = "#packsByFilterNum",
        filterStatusID        = "#packsByListStatus",
        selectedItems         = "#selectedItems";

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
        $(packContentsTableID).html(function () {
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
            if (currentPackData.items.length > WARNING_PACK_LENGTH) {
                $(numItemsWarningID).html(WARNING);
            };
            return results;
        });
    };



    /* Event Handlers */
    $(openNumPacksBtnID).on("click", function (event) {
        $(openForItemStatusID).html("&nbsp;");
        var numPacksToOpen = $(numPacksToOpenID).val();
        if (!isValidNumber(numPacksToOpen)) {
            $(openNumPacksStatusID).html("The quantity must be a number greater " 
                + "than zero!");
        } else {
            numPacksToOpen = Math.ceil(numPacksToOpen);
            $(openNumPacksStatusID).html("Opening " + numPacksToOpen + 
                makePluralIfNeeded(" pack", numPacksToOpen) + "... " + 
                ((parseInt(numPacksToOpen) >= PATIENCE_OPEN_NUM) ? 
                PATIENCE : ""));

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

                writeResultsToTable(numItemsObtained);

                removePatienceMessage(openNumPacksStatusID);

                $(openNumPacksStatusID).append("Done!");

            }, 50);
        } 
    });

    $(openForItemBtnID).on("click", function (event) {
        var targetItem = $(itemDropdownID).find("option:selected")
                                          .val(),
            targetNum = $(openPacksForItemAmtID).val();
        if (targetNum === "") {
            targetNum = 1;
        };
        $(openNumPacksStatusID).html("&nbsp;");
        if (targetItem === "0") {
            $(openForItemStatusID).html("Please select an item!");
        } else if (!isValidNumber(targetNum)) {
            $(openForItemStatusID).html("The quantity must be a number greater " 
                + "than zero!");
        } else {
            targetNum = Math.ceil(targetNum);
            $(openForItemStatusID).html("Opening packs until " + 
                targetNum + " " + targetItem + " obtained... " + 
                ((targetNum >= PATIENCE_ITEM_NUM) ? PATIENCE : ""));

            // run function on a delay because the above HTML won't update without it
            window.setTimeout(function () {
                var numItemsObtained = new Array(currentPackData.items.length).fill(0),
                    numGotten        = 0,
                    numTries         = 0,
                    item,
                    itemIndex;

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

                removePatienceMessage(openForItemStatusID);

                $(openForItemStatusID).append("Done! It took " + numTries 
                    + " packs.");

            }, 50);
        };
    });

    $(addItemToFilterBtnID).on("click", function (event) {
        var targetItem   = $(addItemToFilterID).find("option:selected")
                                               .val();
        if (isAlreadySelected(targetItem)) {
            $(filterStatusID).html("You have already selected this item!");
        } else {
            $(selectedItems).append("<tr><td id=\"" + formatID(targetItem) + 
                "Filter\">" + targetItem + "</td><td>" + REMOVE_BTN + 
                "</td></tr>");
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

    var isAlreadySelected = function (item) {
        return !($("#" + formatID(item) + "Filter").html() == null);
    };

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
    };

    var removePatienceMessage = function (inputID) {
        var statusHtml = $(inputID).html(),
            hasPatienceMessage = statusHtml.includes("... P");
        if (hasPatienceMessage) {
            $(inputID).html(function () {
                var stopIndex = statusHtml.indexOf("... P") + PERIODS_OFFSET;
                return statusHtml.substring(0, stopIndex);
            });
        };
    };

    var isValidNumber = function (number) {
        if (!$.isNumeric(number) || parseFloat(number) <= 0) {
            return false;
        } else {
            return true;
        };
    };

});