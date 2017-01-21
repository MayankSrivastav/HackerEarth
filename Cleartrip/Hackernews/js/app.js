// Main js file for the application
'use strict';

var HackernewsModel = function() {
    this.html = "";
    this.data = "";
};

HackernewsModel.prototype.getHackerNewsData = function(serverUrl) {

};

// This functions extracts the domain 
// from the given url
function getDomainFromUrl(url) {
    let domain;
    
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    // Remove port number if exists
    domain = domain.split(':')[0];
    return domain;
}

// This function gets the data from
// the server using the server url.
// The request is done through XHR
function getHackerNewsData(serverUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) { // if the data is successfully returned           
            var data = JSON.parse(this.responseText);
            var html = "";

            // Dynamically build the HTML to display the 
            // data. 
            for (let i = 1; i < data.length; ++i) {
                 html += "<article><header><strong>&#x2022; <a target='_blank' href=" + data[i].url + ">" + data[i].title +"</a></strong>" 
                 + " from " + getDomainFromUrl(data[i].url) + "</header>"
                 + "</article>" + "<footer><p>" + data[i].num_points + " points by " + data[i].author
                 + " | created: " + data[i].created_at
                 + " | " + data[i].num_comments + " comments"
                 + "</p></footer>";
            }

            // Insert the html in the mainContent area
            document.getElementById("mainContent").innerHTML = html ;
        }
    };

    xhttp.open("GET", serverUrl, true);
    xhttp.send();
}

// Initiate the request from server
getHackerNewsData("http://starlord.hackerearth.com/cleartrip/hackernews");