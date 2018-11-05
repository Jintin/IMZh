function failConnect(xhr, urls, index, callback) {
    if (xhr.readyState === 4 && xhr.status === 404) {
        if (index < urls.length) {
            connectLoop(urls, index + 1, callback);
        }
        return true;
    }
    return false;
}

function successConnect(xhr) {
    return xhr.readyState === 4 && xhr.status === 200;
}

function connectLoop(urls, index, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urls[index], true);
    xhr.onreadystatechange = function() {
        if (failConnect(xhr, urls, index, callback)) {
            return;
        } else if (successConnect(xhr)) {
            var parser = new DOMParser();
            var text = xhr.responseText;
            var doc = parser.parseFromString(text, "text/xml");
            var name = getTitle(doc)
            var WIKI_TAG = " - 維基百科，自由的百科全書";
            if (name.includes(WIKI_TAG)) {
                name = name.replace(WIKI_TAG, "");
            }
            callback(name, text);
        }
    };
    xhr.send();
}

function connect(urls, callback) {
    connectLoop(urls, 0, callback);
}

function getTitle(doc) {
    var list = doc.getElementsByTagName("title");
    if (list) {
        var node = list[0];
        if (node) {
            return node.textContent;
        }
    }
    return "";
}

function getWikiTw(text, callback) {

    connect(["https://zh.wikipedia.org/zh-tw/" + text], function(name, text) {
        if (name) {
            callback(name);
        }
    });
}

function getWikiEn(title, meta, callback) {
    if (cache[title + meta]) {
        callback(cache[title + meta]);
        return;
    }

    chrome.storage.local.get(title + ":" + meta, function(result) {
        if (result[title + ":" + meta]) {
            callback(result[title + ":" + meta]);
            return;
        }
        var list;
        if (meta.includes("TV")) {
            var year = meta.replace("TV Series", "").replace("– ", "").trim();
            list = [
                "https://en.wikipedia.org/wiki/" + title + "_(TV_series)",
                "https://en.wikipedia.org/wiki/" + title + "_(" + year + "_TV_series)",
                "https://en.wikipedia.org/wiki/" + title,
            ];
        } else {
            list = [
                "https://en.wikipedia.org/wiki/" + title + " (" + meta + "_film)",
                "https://en.wikipedia.org/wiki/" + title + " (film)",
                "https://en.wikipedia.org/wiki/" + title
            ];
        }

        connect(list, function(name, text) {
            var checkStart = " – Chinese\" lang=\"zh\"";
            var checkEnd = "title=\"";

            text = text.substring(0, text.indexOf(checkStart));
            text = text.substring(text.lastIndexOf(checkEnd) + checkEnd.length, text.length);
            if (text) {
                getWikiTw(text, function(result) {
                    callback(result);
                    var tag = title + ":" + meta;
                    chrome.storage.local.set({
                        [tag]: result
                    }, function() {});
                });
            }
        });
    });
}