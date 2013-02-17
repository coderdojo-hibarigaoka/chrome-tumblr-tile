$(function() {

    tumblrTile.loadConfig();

    var $baseWidth = $('#setting input[name="baseWidth"]');
    var $margin    = $('#setting input[name="margin"]');

    $baseWidth.val(tumblrTile.config.baseWidth);
    $margin.val(tumblrTile.config.margin);

    $("#setting").submit(function() {
        var hash = {
            baseWidth: parseInt($baseWidth.val()),
            margin   : parseInt($margin.val())
        };

        tumblrTile.saveConfig(hash);
        return false;
    });
});
