$(function () {

    console.log("Hello help!");

    $("#process").on("click", function (event) {
        console.log("CLEAR");
        var textVal = $("#packSection").val();
        $("#packSection").val(" ");
        var res = textVal.split("\n");
        var colonIndex;
        var numSpaces = 0;
        var spaceArray = [];
        var spaceString = "";
        for (var i = 0 ; i < res.length; i++) {
            console.log(res[i]);
            colonIndex = res[i].indexOf("\" : \"");
            if (colonIndex < 32) {
                numSpaces = 32 - colonIndex;
                spaceArray = new Array(numSpaces - 1).fill(" ");
                spaceString = spaceArray.join("");
                res[i] = res[i].substring(0, colonIndex + 2) + spaceString + res[i].substring(colonIndex + 1, res[i].length);
            }
            $("#packSection").val(function () {
                return $(this).val() + "\n" + res[i];
            });
        };
        console.log("done");
    });

});