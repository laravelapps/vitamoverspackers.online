
//LBW


var ReferralRockNameSpace =    
(function () {
    
    executenow();

    //Check mode of operation

    function executenow() {
       
        var mode;
        var targetid;
        var debug = "false";
        
        if (typeof rrAppsettings !== "undefined")
        {
            if (rrAppsettings !== null)
            {
                mode = rrAppsettings.mode;
                debug = rrAppsettings.debug;
                targetid = rrAppsettings.targetid;

                //Check if mode is valid

                var route;  //URL Route
                var action; //Action to take        

                switch (mode) {
                    case "access":
                        route = "access";
                        action = "replacelink";
                        break;
                    case "referralupdate":
                        route = "referralupdate";
                        action = "postpixel";
                        break;
                    case "conversion":
                        route = "webcallback";
                        action = "postpixel";
                        break;
                    default:
                        return;
                }

                //Get the URL
                var parser = getParser();
                var basehost = parser.host;
                var scriptV = parser.href;
                var url = buildURL(basehost, route, debug, scriptV);

                //take action
                switch (action) {
                    case "postpixel":
                        // Post pixel
                        var div = document.createElement('div');
                        div.setAttribute("id", "rrPixel");

                        if (debug === "true") {
                            div.innerHTML = "<iframe src='" + url + "' scrolling='yes' frameborder='0' width='600' height='800'></iframe>";
                        }
                        else {
                            //none debug... so hide it
                            div.innerHTML = "<iframe src='" + url + "' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
                            div.style.display = "none";
                        }
                        document.body.appendChild(div);

                        break;
                        //Used for Access... to replace the link.
                    case "replacelink":
                        var targetElement = document.getElementById(targetid);

                        if (targetElement) {
                            if (targetElement.nodeName === 'A') {
                                targetElement.setAttribute("href", url);
                            }
                            else if (targetElement.nodeName === 'IFRAME') {
                                targetElement.setAttribute("src", url);
                            }
                            else if (targetElement.nodeName === 'INPUT') {
                                targetElement.setAttribute("onclick", "window.location='" + url + "'");
                            }

                        }

                        // Post Debug Iframe
                        if (debug === "true") {
                            var div2 = document.createElement('div');
                            div2.setAttribute("id", "rrPixel");
                            div2.innerHTML = "<iframe src='" + url + "' scrolling='yes' frameborder='0' width='600' height='800'></iframe>";

                            document.body.appendChild(div2);
                        }

                        break;

                    default:
                        return;
                }
            }
        }      
    }
 
    //Utility Functions
    
    //returns URL w/ parameters
    function buildURL(basehost, route, debug, scriptV)
    {
        var url = "//" + basehost + "/" + route + "/?";

        var decodeHtmlEntity = function (str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        };
        //Build w/ Parameters
        if (typeof rrParameters !== "undefined") {
            if (rrParameters !== null) {
                for (var key in rrParameters) {
                    // skip loop if the property is from prototype
                    if (!rrParameters.hasOwnProperty(key)) continue;

                    var value = rrParameters[key];

                    //only write if has value
                    if (value !== "") {

                        switch (key.toLowerCase()) {
                            case "email":
                                //No decode of email... as it removes our fav plus.
                                url += key + "=" + encodeURIComponent(value) + "&";
                                break;
                            case "amount":
                                //strip out any sign that is not a number as the first character
                                var amountTest = decodeHtmlEntity(value);
                                if (!amountTest.substring(0, 1).match(/^[0-9]+$/)) {
                                    amountTest = amountTest.substring(1);
                                }

                                url += key + "=" + encodeURIComponent(amountTest) + "&";
                                break;
                            default:
                                //All else decode HTML Entities
                                var stringTest = decodeHtmlEntity(value);
                                url += key + "=" + encodeURIComponent(stringTest) + "&";
                        }
                    }
                }
            }
        }

        var rrUniversalVersion = "11-02-18";

        url += "scriptv=" + encodeURI(scriptV + "?" + rrUniversalVersion);
		
		if (window.location.href.length < 1000)
		{
			url += "&sourceURL=" + encodeURI(window.location.href);
		}
        
        //Add debug
        if (debug === "true") {
            url += "&debug=true";
        }

        return url;
    }

    //returns host from self script
    function getParser() {
        var fullJsUrl = document.getElementById("RR_DIVID").getAttribute("src");
        var parser = document.createElement('a');
        parser.href = fullJsUrl;

        return parser;
    }

    function qp(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results === null)
            return null;
        else
            return decodeURIComponent(results[1]);
    }
})(); // We call our anonymous function immediately




