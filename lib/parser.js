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
                var parser = new DOMParser()
                var text = xhr.responseText;
                var doc = parser.parseFromString(text, "text/xml");
                var name = doc.getElementsByTagName("title")[0].textContent;
                var WIKI_TAG = " - 維基百科，自由的百科全書";
                if (name.includes(WIKI_TAG)) {
                    name = name.replace(WIKI_TAG, "");
                }
                callback(name, text);
            }
        }
        xhr.send();
    }
}

function getWikiTw(text, callback) {

    connect(["https://zh.wikipedia.org/zh-tw/" + text], function(name, text) {
        if (name) {
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

        connect(list, function(name, text) {
            var checkStart = " – Chinese\" lang=\"zh\"";
            var checkEnd = "title=\"";

            text = text.substring(0, text.indexOf(checkStart));
            text = text.substring(text.lastIndexOf(checkEnd) + checkEnd.length, text.length);
            if (text) {
                getWikiTw(text, function(result) {
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