$(function () {

    console.log("Hello help!");

    $("#process").on("click", function (event) {
        var textVal = $("#packSection").val();
        $("#packSection").val(" ");
        var textValAsArray = textVal.split("\n");
        var colonIndex;
        var numSpaces = 0;
        var spaceArray = [];
        var spaceString = "";
        for (var i = 0 ; i < textValAsArray.length; i++) {
            console.log(textValAsArray[i]);
            colonIndex = textValAsArray[i].indexOf("\" : \"");
            if (colonIndex < 32) {
                numSpaces = 32 - colonIndex;
                spaceArray = new Array(numSpaces - 1).fill(" ");
                spaceString = spaceArray.join("");
                textValAsArray[i] = textValAsArray[i].substring(0, colonIndex + 2) + 
                    spaceString + textValAsArray[i].substring(colonIndex + 1, textValAsArray[i].length);
            }
            $("#packSection").val(function () {
                return $(this).val() + "\n" + textValAsArray[i];
            });
        };
        console.log("done");
    });

    $("#reverse").on("click", function (event) {
        var textVal = $("#packSection").val();
        $("#packSection").val(" ");
        var textValAsArray = textVal.split("\n");
        var reverse = textValAsArray.reverse();
        for (var i = 0; i < reverse.length; i++) {
            $("#packSection").val(function () {
                return $(this).val() + "\n" + reverse[i];
            });
        }
    });

});