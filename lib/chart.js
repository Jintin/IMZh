nodes = document.querySelectorAll('.titleColumn');

for (var i = 0; i < nodes.length; i++) {
    var year = nodes[i].children[1].textContent.replace("(", "").replace(")", "");
    var title = nodes[i].children[0].textContent
    var target = nodes[i].children[1];
    getMovie(target, title, year);
}

function getMovie(target, title, year) {
    getWikiEn(title, year, function(name) {
        target.textContent = name + "(" + year + ")";
    })
}