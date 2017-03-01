nodes = document.querySelectorAll('.lister-item');

for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i].getElementsByClassName('lister-item-header')[0];
    var title = node.children[1].textContent
    var year = node.children[2]
        .textContent.replace("(", "").replace(")", "");
    getWikiEn(node.children[2], title, year, function(target, name) {
        target.textContent = name + "(" + year + ")";
    })
}
