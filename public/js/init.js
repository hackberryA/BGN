console.log("init")
document.addEventListener("DOMContentLoaded", function () {
    var el = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(el, {});
});
document.addEventListener('DOMContentLoaded', function() {
var elems = document.querySelectorAll('.tooltipped');
var instances = M.Tooltip.init(elems, options);
});
