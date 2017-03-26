function connect(url, callback) {
    process(0);

    function process(index) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url[index], true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 404) {
                if (index < url.length) {
                    process(index + 1);
                } else {
                    console.log("not found");
                }
                return;
            }
            if (xhr.readyState === 4 && xhr.status === 200) {
                var name = xhr.responseText;
                callback(name);
            }
        }
        xhr.send();
    }
}

function getWikiTw(text, callback) {

    connect(["https://zh.wikipedia.org/zh-tw/" + text], function(name) {
        var checkStart = "<h1 id=\"firstHeading\" class=\"firstHeading\" lang=\"zh-TW\">";
        var checkEnd = "</h1>";
        if (name) {
            name = name.substring(name.indexOf(checkStart) + checkStart.length);
            name = name.substring(0, name.indexOf(checkEnd));
            if (name.includes("(")) {
                name = name.substring(0, name.indexOf("("));
            }
            callback(name);
        }
    });
}

function getWikiEn(title, year, callback) {
    if (cache[title + year]) {
        callback(cache[title + year]);
        return
    }
    chrome.storage.local.get(title + year, function(result) {
        if (result[title + year]) {
            callback(result[title + year]);
            return;
        }
        list = [
            "https://en.wikipedia.org/wiki/" + title + " (" + year + "_film)",
            "https://en.wikipedia.org/wiki/" + title + " (film)",
            "https://en.wikipedia.org/wiki/" + title
        ];

        connect(list, function(name) {
            var checkStart = " – Chinese\" lang=\"zh\"";
            var checkEnd = "title=\"";
            name = name.substring(0, name.indexOf(checkStart));
            name = name.substring(name.lastIndexOf(checkEnd) + checkEnd.length, name.length);
            if (name) {
                getWikiTw(name, function(result) {
                    callback(result);
                    var tag = title + year;
                    chrome.storage.local.set({
                        [tag]: result
                    }, function() {});
                });
            }
        });
    });
}
