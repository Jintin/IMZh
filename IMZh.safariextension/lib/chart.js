nodes = document.querySelectorAll('.titleColumn');

for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i].children[0];
    var year = nodes[i].children[1].textContent.replace("(", "").replace(")", "");
    var title = node.textContent

    getWikiEn(nodes[i].children[1], title, year, function(target, name) {
        target.textContent = name + "(" + year + ")";
    })
}
