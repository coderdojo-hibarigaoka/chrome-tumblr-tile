$(function() {
$('a').click(function(e){
chrome.tabs.update({url: "chrome-internal://newtab/"});

e.preventDefault();
});
tumblrTile.draw();
});
