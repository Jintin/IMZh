var title = document.title.substring(0, document.title.indexOf("(")).trim();
var year = document.title.substring(document.title.indexOf("(") + 1,
    document.title.indexOf(")"));
var target = document.getElementById("titleYear");
var type = document.querySelector('a[title="See more release dates"]');

getWikiEn(title, year, function(name) {
    if (target) {
        target.textContent = name + "(" + year + ")";
    } else {
        var parent = document.getElementsByClassName("title_wrapper")[0].childNodes[1];
        var node = document.createElement("span");
        node.id = "titleYear";
        node.textContent = name;
        parent.appendChild(node);
    }
});