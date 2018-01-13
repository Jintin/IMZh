#!/usr/bin/env node

var title = document.title.substring(0, document.title.indexOf("(")).trim();
var year = document.title.substring(document.title.indexOf("(") + 1,
    document.title.indexOf(")"));
var target = document.getElementById('titleYear');

getWikiEn(title, year, function(name) {
    target.textContent = name + "(" + year + ")";
});
