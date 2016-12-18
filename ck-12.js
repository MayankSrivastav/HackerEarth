// Models, Views and Controllers for Path Optimizer application

// Model for left panel
var Graph = function(){
    this.nodes = [];
    this.edges = [];
    this.numberOfEdges = 0;  
    this.allPaths = [];       
    this.input = "";            // Store the JSON input 
    this.min = 99999;           // Store the shortest/quickest path index
    this.nodeToNodeDist = []    // This stores node to node distances for all paths

    // Initialize Graph with nodes    
    Graph.prototype.addNodes = function (node) {
        this.nodes.push(node);
        this.edges[node] = [];  
    };

    // Graph input
    Graph.prototype.readInput = function(input) {
        this.input = input;
    };

    // Initialize Graph with edges
    Graph.prototype.addEdges = function(node1, node2) {        
        this.edges[node1].push(node2);   
        this.numberOfEdges++;     
    };

    // DFS to find all paths between 
    // source node & destination node
    Graph.prototype.findAllPaths = function(source, destination) {
        var path = [];
        var pathIdx = 0;
        var visited = [];

        this.findAllPaths_(source, destination, visited, path, pathIdx);
    };

    Graph.prototype.findAllPaths_ = function(s, d, visited, path, pathIdx) {
        // Mark the current node as visited and store 
        // this node in path array
        visited[s] = true;
        path[pathIdx] = s;
        pathIdx++;

        // If the current node and the destination is
        // same, then store this path in allPaths array
        //
        // If the current node is not same as destination
        // then all nodes adjacent to the current node
        if (s === d) {
            //var temp = "", dist, idx;
            var tmpPath = [];
            for (var i = 0; i < pathIdx; i++) {
                tmpPath.push(path[i]);
            }
            
            //console.log(temp);
            this.allPaths.push(tmpPath);
        } else {
            for (var i = 0; i < this.edges[s].length; i++) {
                if (!visited[this.edges[s][i]]) {
                    this.findAllPaths_(this.edges[s][i], d, visited, path, pathIdx);
                }
            }
        }

        pathIdx--;
        visited[s] = false;        
    };

    // This function returns the Shortest or the Quickest
    // path as requested
    Graph.prototype.shortestPath = function(shortOrQuick) {
        var minDist = this.min;
        if (shortOrQuick === "sp") {    // if user selects for shortest path
            for (var i = 0; i < this.allPaths.length; i++) {
                var dist = 0, nToN = [];
                for (var j = 0; j < this.allPaths[i].length - 1; j++) {
                    nToN.push(this.input[String.fromCharCode(this.allPaths[i][j])][String.fromCharCode(this.allPaths[i][j + 1])][1]);
                    dist += this.input[String.fromCharCode(this.allPaths[i][j])][String.fromCharCode(this.allPaths[i][j + 1])][1]; 
                }
                this.nodeToNodeDist.push(nToN);     // Store all node to node distances in array

                if (dist < minDist) {
                    this.min = i;
                    minDist = dist;
                }
            }
        } else if (shortOrQuick === "qp") {     // if user selects quickest path
            for (var i = 0; i < this.allPaths.length; i++) {
                var dist = 0, nToN = [], speed = 0, time = 9999;
                for (var j = 0; j < this.allPaths[i].length - 1; j++) {
                    nToN.push(this.input[String.fromCharCode(this.allPaths[i][j])][String.fromCharCode(this.allPaths[i][j + 1])][1]);
                    dist += this.input[String.fromCharCode(this.allPaths[i][j])][String.fromCharCode(this.allPaths[i][j + 1])][1]; 
                    speed += this.input[String.fromCharCode(this.allPaths[i][j])][String.fromCharCode(this.allPaths[i][j + 1])][0];
                }
                this.nodeToNodeDist.push(nToN);     // Store all node to node distances in array

                if ((dist / speed) < time) {
                    this.min = i;
                    time = (dist / speed);
                }
            }
        }
    };    
};

// View for left main panel
var leftPanelMainView = {
    init: function() {   
        this.go = document.getElementById('btnGo');             
        this.go.addEventListener('click', function() {
            controller.init();  // Initialize the controller
        });
    },

    // This function renders the views on the page
    render: function(min, allPaths, nToNDist) {
        var resultDiv = document.getElementById("result");
        var elem = '<div class="nodeRep">';
        // First print the optimal route        
        for (var k = 0; k < allPaths[min].length; k++) {
            elem += '<span>' + String.fromCharCode(allPaths[min][k]) + '</span>' + leftPanelMainView.printLine(nToNDist[min][k]);                
        } 
        elem += '&nbsp&nbsp&nbsp&nbsp<span style="border-radius:5px;border:1px solid;background-color:#a7f1f1">&nbspBest Route&nbsp</span></br></br>';
        for (var i = 0; i < allPaths.length; i++) {
            if (i !== min) {
                for (var j = 0; j < allPaths[i].length; j++) {
                    elem += '<span>' + String.fromCharCode(allPaths[i][j]) + '</span>' + leftPanelMainView.printLine(nToNDist[i][j]);                
                }   
                elem += '</br></br>';
            } 
        }
        elem += "</div>";
        document.getElementById("result").innerHTML = elem;
    },

    printLine: function(noOfTimes) {
        var lines = "";
        for (var i = 0; i < noOfTimes; i++) {
            lines += '<img src="images/one.png">';
        }

        return lines;
    }
};

// Main controller of the view & model
var controller = {    
    init: function(type) {
        // Initialize the Graph with predefined
        // distances
        var graph = new Graph();
        graph.addNodes('S'.charCodeAt(0));
        graph.addNodes('T'.charCodeAt(0));
        graph.addNodes('U'.charCodeAt(0));
        graph.addNodes('V'.charCodeAt(0));
        graph.addNodes('X'.charCodeAt(0));
        graph.addNodes('W'.charCodeAt(0));
        
        //graph.print(); // 1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->
        
        graph.addEdges('S'.charCodeAt(0), 'T'.charCodeAt(0));
        graph.addEdges('S'.charCodeAt(0), 'V'.charCodeAt(0));
        graph.addEdges('S'.charCodeAt(0), 'X'.charCodeAt(0));
        graph.addEdges('T'.charCodeAt(0), 'V'.charCodeAt(0));
        graph.addEdges('T'.charCodeAt(0), 'X'.charCodeAt(0));
        graph.addEdges('U'.charCodeAt(0), 'S'.charCodeAt(0));
        graph.addEdges('U'.charCodeAt(0), 'T'.charCodeAt(0));
        graph.addEdges('V'.charCodeAt(0), 'U'.charCodeAt(0));
        graph.addEdges('X'.charCodeAt(0), 'V'.charCodeAt(0));
        graph.addEdges('X'.charCodeAt(0), 'W'.charCodeAt(0));
        graph.addEdges('W'.charCodeAt(0), 'S'.charCodeAt(0));
        graph.addEdges('W'.charCodeAt(0), 'U'.charCodeAt(0)); 

        // JSON input for the graph
        var input = {
                    "S": {
                        "T": [
                        5,
                        7
                        ],
                        "X": [
                        4,
                        4
                        ],
                        "V": [
                        4,
                        2
                        ]
                    },
                    "T": {
                        "X": [
                        3,
                        1
                        ],
                        "V": [
                        5,
                        2
                        ]
                    },
                    "U": {
                        "S": [
                        7,
                        2
                        ],
                        "T": [
                        4,
                        6
                        ]
                    },
                    "V": {
                        "U": [
                        4,
                        5
                        ]
                    },
                    "X": {
                        "V": [
                        2,
                        1
                        ],
                        "W": [
                        5,
                        3
                        ]
                    },
                    "W": {
                        "U": [
                        7,
                        5
                        ],
                        "S": [
                        8,
                        3
                        ]
                    }
                }
        graph.readInput(input);

        // Read user inputs
        var start = document.getElementById("txtStart").value.charCodeAt(0);
        var end = document.getElementById("txtEnd").value.charCodeAt(0);                

        // Find all the paths between start and end nodes
        graph.findAllPaths(start, end);
        var option;
        var go = document.getElementById('btnGo');
        if (document.getElementById('sp').checked) {
            option = "sp"; // shortest path
        } else {
            option = "qp"; // quickest path
        }
        graph.shortestPath(option);
        leftPanelMainView.render(graph.min, graph.allPaths, graph.nodeToNodeDist);  
    }
};

// Start the app
leftPanelMainView.init();