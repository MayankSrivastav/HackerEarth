// Main js file for the application
'use strict';

// The model for the application
var HackernewsModel = function() {
    this.html = "";
    this.data = "";
    this.database = undefined;    
};

// This function gets the data from
// the server using the server url.
// The request is done through XHR
HackernewsModel.prototype.getHackerNewsData = function(serverUrl) {
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

HackernewsModel.prototype.getNewsSearchResults = function(searchString) {  
    var self = this;
    var request = window.indexedDB.open("newsItemDB", 8);
    
    request.onerror = function(event) {
        console.log("error: ");
    };
        
    request.onsuccess = function(event) {  
        
        var db = request.result;
        
        var objectStore = db.transaction("newsItems").objectStore("newsItems");
        var index = objectStore.index("author");
        var results = [], i = 0;        
        document.getElementById("mainContent").innerHTML = "";

        index.openCursor().onsuccess = function(event) {                        
            var cursor = event.target.result;
            if (cursor) {
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
            }                              
        }      
    }    
};

HackernewsModel.prototype.writeToDB = function(newsData) {     
    var db;   
    var request = window.indexedDB.open("newsItemDB", 8);            

    request.onerror = function(event) {
        console.log("error: ");
    };
    
    request.onsuccess = function(event) {
        var db = request.result;
        // this.database = db;
        
        console.log("success: "+ db);                
    };        

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        db.deleteObjectStore("newsItems");
        var objectStore = db.createObjectStore("newsItems", { keyPath: "id" });
        objectStore.createIndex("author", "author", { unique: false });

        objectStore.transaction.oncomplete = function(event) {
            // Store values in the newly created objectStore.
            var newsObjectStore = db.transaction("newsItems", "readwrite").objectStore("newsItems");
            for (var i = 1; i < newsData.length; ++i) {
                newsObjectStore.add(newsData[i]);
            }               
        }
    };                         
};

// HackernewsModel.prototype.initNewsDB = function(newData) {   
//     return new Promise(function(resolve, reject) {     
            
//     });                 
// };


// function checkIndexDBSupport() {
//     // Check if indexedDB is supported by the browser
//     window.indexedDB = window.indexedDB || window.mozIndexedDB 
//                     || window.webkitIndexedDB || window.msIndexedDB;
    
//     //prefixes of window.IDB objects
//     window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction
//                             || window.msIDBTransaction;

//     window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange 
//                         || window.msIDBKeyRange
    
//     if (!window.indexedDB) {
//         return false;
//         //window.alert("Your browser doesn't support a stable version of IndexedDB.")
//     } else {
//         return true;
//     }   
// }

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
        var results = newData.getNewsSearchResults(searchString);        
    }
};

// Initiate the request from server
let serverUrl = "http://starlord.hackerearth.com/cleartrip/hackernews";
HackernewsController.init(serverUrl);