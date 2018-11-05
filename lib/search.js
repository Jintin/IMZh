function getMovie(title, year, target) {
    getWikiEn(title, year, function(name) {
        target.textContent = name + "(" + year + ")";
    });
}

var nodes = document.querySelectorAll(".lister-item");

for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i].getElementsByClassName("lister-item-header")[0];
    var target = node.children[2];
    var title = node.children[1].textContent;
    var year = node.children[2].textContent
        .replace("(", "").replace(")", "");
    getMovie(title, year, target);
}