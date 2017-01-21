// Main js file for the application
'use strict';

// The model for the application
var HackernewsModel = function() {
    this.html = "";
    this.data = "";        
};

// This function gets the data from
// the server using the server url.
// The request is done through XHR
HackernewsModel.prototype.getHackerNewsData = function(serverUrl) {
    document.getElementById("mainContent").innerHTML = "<strong>Please wait...</strong>";
    var self = this;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) { // if the data is successfully returned           
            this.data = JSON.parse(this.responseText);            
            
            // Dynamically build the HTML to display the 
            // data. 
            for (let i = 1; i < this.data.length; ++i) {
                 self.html += "<article><header><strong>&#x2022; <a target='_blank' href=" + this.data[i].url + ">" + this.data[i].title +"</a></strong>" 
                 + " from " + self.getDomainFromUrl(this.data[i].url) + "</header>"
                 + "</article>" + "<footer><p>" + this.data[i].num_points + " points by " + this.data[i].author
                 + " | created: " + this.data[i].created_at
                 + " | " + this.data[i].num_comments + " comments"
                 + "</p></footer>";
            }

            // Insert the html in the mainContent area
            HackernewsView.render(self.html) ;

            if (self.checkIndexDBSupport)
                self.writeToDB(this.data);
        }
    };

    xhttp.open("GET", serverUrl, true);
    xhttp.send();
};

// This functions extracts the domain 
// from the given url
HackernewsModel.prototype.getDomainFromUrl = function(url) {
    let domain;
    
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    // Remove port number if exists
    domain = domain.split(':')[0];
    return domain;
};

// This function returns the matched
// results of the search string. if
// no entry is matched then it returns
// an error message
HackernewsModel.prototype.getNewsSearchResults = function(searchString) {  
    var self = this;
    if (!self.checkIndexDBSupport) {
        document.getElementById("mainContent").innerHTML += "Your browser doesn't support database operations :(";
        return;
    }

    var request = window.indexedDB.open("newsItemDB", 8);
    
    request.onerror = function(event) {
        console.log("error: ");
    };
        
    request.onsuccess = function(event) {          
        var db = request.result;

        var transaction = db.transaction(["newsItems"], "readwrite");
        var objectStore = transaction.objectStore("newsItems");
        var index = objectStore.index("author");
        var results = [], i = 0;        
        document.getElementById("mainContent").innerHTML = "";

        index.openCursor().onsuccess = function(event) {                        
            var cursor = event.target.result;     
                   
            if (cursor) {
            // If an entry is matched then append 
            // the values to the HTML
            if (cursor.key === searchString) {
                results.push(cursor.value);
                self.html = "<article><header><strong>&#x2022; <a target='_blank' href=" + results[i].url + ">" + results[i].title +"</a></strong>" 
                + " from " + self.getDomainFromUrl(results[i].url) + "</header>"
                + "</article>" + "<footer><p>" + results[i].num_points + " points by " + results[i].author
                + " | created: " + results[i].created_at
                + " | " + results[i].num_comments + " comments"
                + "</p></footer>";
                document.getElementById("mainContent").innerHTML += self.html;
                i++;
            }
                            
            cursor.continue();
            } else {
                // If no entry matched then return error
                if (document.getElementById("mainContent").innerHTML === "")
                    document.getElementById("mainContent").innerHTML = "Your search returned 0 results.";
            }                                            
        }      
    }    
};

// This function writes the returned results to
// indexdb
HackernewsModel.prototype.writeToDB = function(newsData) {        
    var db;   
    var request = window.indexedDB.open("newsItemDB", 8);            

    request.onerror = function(event) {
        console.log("error: ");
    };
    
    request.onsuccess = function(event) {
        var db = request.result;    
        //console.log("success: "+ db);                
    };        

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        
        var objectStore = db.createObjectStore("newsItems", { keyPath: "id" });
        objectStore.createIndex("author", "author", { unique: false });

        // If successfully created the object store and indexes
        // then store the data returned from server in the object
        // store for later use
        objectStore.transaction.oncomplete = function(event) {
            // Store values in the newly created objectStore.
            var newsObjectStore = db.transaction("newsItems", "readwrite").objectStore("newsItems");
            for (var i = 1; i < newsData.length; ++i) {
                newsObjectStore.add(newsData[i]);
            }               
        }
    };                          
};

// This function checks if IndexedDB operations
// are supported on the browser
HackernewsModel.prototype.checkIndexDBSupport = function() {
    // Check if indexedDB is supported by the browser
    window.indexedDB = window.indexedDB || window.mozIndexedDB 
                    || window.webkitIndexedDB || window.msIndexedDB;
    
    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction
                            || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange 
                        || window.msIDBKeyRange
    
    if (!window.indexedDB) {
        return false;
        //window.alert("Your browser doesn't support a stable version of IndexedDB.")
    } else {
        return true;
    }   
};

// The view of the application
// This is updated by the HackernewsModel
// for every request
var HackernewsView = {
    init: function() {
        this.go = document.getElementById("btnGo");
        this.go.addEventListener('click', function(){
            HackernewsController.getSearchResults(document.getElementById("articleSearch").value);
        });
    },

    // Once the data is returned, update the 
    // view of the application
    render: function(newsHtml) {
        document.getElementById("mainContent").innerHTML = "";
        document.getElementById("mainContent").innerHTML = newsHtml;
    }
};

// The main controller of the application
// It manipulates the HackernewsModel
var HackernewsController = {
    // This is the actual function which
    // initializes the request from server
    // for news data
    init: function(serverUrl) {
        HackernewsView.init();

        var newData = new HackernewsModel();
        newData.getHackerNewsData(serverUrl);
    },

    getSearchResults: function(searchString) {
        var newData = new HackernewsModel();
        var results = newData.getNewsSearchResults(searchString.trim());        
    }
};

// Initiate the request from server
let serverUrl = "http://starlord.hackerearth.com/cleartrip/hackernews";
HackernewsController.init(serverUrl);