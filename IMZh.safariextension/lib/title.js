title = document.title.substring(0, document.title.indexOf("(")).trim()
year = document.title.substring(document.title.indexOf("(") + 1,
    document.title.indexOf(")"))

node = document.getElementById('titleYear');

getWikiEn(node, title, year, function(target, name) {
    node.textContent = name + "(" + year + ")";
});
