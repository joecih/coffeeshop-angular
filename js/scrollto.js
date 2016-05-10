var delay = false;
var _onRootPath = true;


window.onhashchange = function() {
    var _winPath = window.location.href;
    _winPath = _winPath.split("/#/");
    //console.log("Win Path: " + _winPath);

    if (_winPath[1] === "") {
        //console.log(_winPath);
        _onRootPath = true;
    } else {
        //console.log("OTHER PATH CALLED!!");
        _onRootPath = false;
    }
}

$(document).on('mousewheel DOMMouseScroll', function(event) {
    //event.preventDefault();

    if (_onRootPath) {
        if (delay) return;


        delay = true;
        setTimeout(function() {
            delay = false
        }, 800)

        var wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;

        var a = document.getElementsByTagName('scroll-pnt');
        if (wd < 0) {
            for (var i = 0; i < a.length; i++) {
                var t = a[i].getClientRects()[0].top;
                if (t >= 40) break;
            }
        } else {
            for (var i = a.length - 1; i >= 0; i--) {
                var t = a[i].getClientRects()[0].top;
                if (t < -20) break;
            }
        }

        // clean's up 'undefined error'
        i = (i >= a.length) ? a.length - 1 : ((i < 0) ? 0 : i);
        //console.log(i);

        $('.main-content').animate({
            scrollTop: a[i].offsetTop
        });
    }
});
