// Models, Views and Controllers for Path Optimizer application

// Model for left panel
var Graph = function(){
    this.nodes = [];
    this.edges = [];
    this.numberOfEdges = 12;  
    this.allPaths = [];       

    // Initialize Graph with nodes    
    Graph.prototype.addNodes = function (node) {
        this.nodes.push(node);
        this.edges[node] = [];  
    };

    // Initialize Graph with edges
    Graph.prototype.addEdges = function(node1, node2) {        
        this.edges[node1].push(node2);        
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
            var temp = "";
            for (var i = 0; i < pathIdx; i++) {
                temp += String.fromCharCode(path[i]) + '-->';                
            }
            console.log(temp);
            this.allPaths.push(path);
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

    /*Graph.prototype.print = function() {
        console.log(this.nodes.map(function(vertex) {
            return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
        }, this).join(' | '));
    };*/   
};

// View for left main panel
var leftPanelMainView = {
    init: function() {
        this.go = document.getElementById('btnGo');

        this.go.addEventListener('click', function() {
            // Add code
        });
    }
};

var controller = {
    // Init function called by the controller
    // on page load
    init: function() {
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
    
        //graph.findAllPaths('S'.charCodeAt(0), 'V'.charCodeAt(0));  
    }
};

controller.init();