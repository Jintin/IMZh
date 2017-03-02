function connectWikiEn(urls) {
	console.log("connect to: " + urls);
	safari.self.tab.dispatchMessage("connectWikiEn", urls);	
}

function connectWikiTw(name) {
	var url = "https://zh.wikipedia.org/zh-tw/" + name
	console.log("connect to: " + [url]);
	safari.self.tab.dispatchMessage("connectWikiTw", [url]);	
}
 
function parseEvent(theMessageEvent) {
	if (theMessageEvent.name === "connectWikiEn") {
		var content = theMessageEvent.message;

		var title = document.title.substring(0, document.title.indexOf("(")).trim()
		var year = document.title.substring(document.title.indexOf("(") + 1, document.title.indexOf(")"))
		var node = document.getElementById('titleYear');
		
		var checkStart = " – Chinese\" lang=\"zh\"";
        var checkEnd = "title=\"";

        var name = content;
        name = name.substring(0, name.indexOf(checkStart));
        name = name.substring(name.lastIndexOf(checkEnd) + checkEnd.length, name.length);
        if (name) {
            connectWikiTw(name)
        }
	}

	if (theMessageEvent.name === "connectWikiTw") {
		var checkStart = "<h1 id=\"firstHeading\" class=\"firstHeading\" lang=\"zh-TW\">";
        var checkEnd = "</h1>";

        var content = theMessageEvent.message;
        var name = content;
        var title = document.title.substring(0, document.title.indexOf("(")).trim()
		var year = document.title.substring(document.title.indexOf("(") + 1, document.title.indexOf(")"))
		var node = document.getElementById('titleYear');
        if (name && title && year && node) {
            name = name.substring(name.indexOf(checkStart) + checkStart.length);
            name = name.substring(0, name.indexOf(checkEnd));
            if (name.includes("(")) {
                name = name.substring(0, name.indexOf("("));
            }
            node.textContent = name + "(" + year + ")";
        }
	}
}

safari.self.addEventListener("message", parseEvent, false);
