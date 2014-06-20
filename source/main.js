var canvasWrapper;

window.onload = function (){
    var setLinks = document.querySelectorAll("menu a");
    for (var i = 0; i < setLinks.length; i++) {
        setLinks[i].onclick = function (e) {
            e.preventDefault();
            var setCheckerName = this.getAttribute("data-set-checker");
            var src = this.getAttribute("data-src");
            initializeSet(setCheckerName, src);
        }
    }
}

function initializeSet(setCheckerName, src) {
    var scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src = src;
    var head = document.querySelector("head");
    head.appendChild(scriptTag);
}