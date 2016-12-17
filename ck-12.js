// Models, Views and Controllers for Path Optimizer application

// Model for left panel
var leftPanelMainModel = {
    Graph: function () {
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
            var paths = [];
            var pathIdx = 0;
            var visited = [];

            this.findAllPaths_(source, destination, visited, paths, pathIdx);
        };

        Graph.prototype.findAllPaths_ = function(s, d, visited, paths, pathIdx) {
            // Mark the current node as visited and store 
            // this node in path array
            visited[s] = true;
            path[pathIdx] = source;
            pathIdx++;

            // If the current node and the destination is
            // same, then store this path in allPaths array
            //
            // If the current node is not same as destination
            // then all nodes adjacent to the current node
            if (s === d) {
                allPaths.push(path);
            } else {
                for (var i = 0; i < this.edges[s].length; i++) {
                    if (!visited[this.edges[s][i]]) {
                        findAllPaths_(s, d, visited, paths, pathIdx);
                    }
                }
            }

            pathIdx--;
            visited[d] = false;        
        };

        Graph.prototype.print = function() {
            console.log(this.vertices.map(function(vertex) {
                return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
            }, this).join(' | '));
        };

        var graph = new Graph();
        graph.addNodes(0);
        graph.addNodes(1);
        graph.addNodes(2);
        graph.addNodes(3);
        graph.addNodes(4);
        graph.addNodes(5);
        
        graph.print(); // 1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->
        
        graph.addEdge(0, 1);
        graph.addEdge(0, 3);
        graph.addEdge(0, 4);
        graph.addEdge(1, 3);
        graph.addEdge(1, 4);
        graph.addEdge(2, 0);
        graph.addEdge(2, 1);
        graph.addEdge(3, 2);
        graph.addEdge(4, 5);
        graph.addEdge(4, 3);
        graph.addEdge(5, 0);
        graph.addEdge(5, 2);
    },

    /*init: function() {
        var graph = new Graph();
        graph.addNodes(0);
        graph.addNodes(1);
        graph.addNodes(2);
        graph.addNodes(3);
        graph.addNodes(4);
        graph.addNodes(5);
        
        graph.print(); // 1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->
        
        graph.addEdge(0, 1);
        graph.addEdge(0, 3);
        graph.addEdge(0, 4);
        graph.addEdge(1, 3);
        graph.addEdge(1, 4);
        graph.addEdge(2, 0);
        graph.addEdge(2, 1);
        graph.addEdge(3, 2);
        graph.addEdge(4, 5);
        graph.addEdge(4, 3);
        graph.addEdge(5, 0);
        graph.addEdge(5, 2);
    }*/
};

// View for left main panel
var leftPanelMainView = {
    init: function() {
        this.go = document.getElementById('btnGo');

        this.go.addEventListener('click', function() {
            controller.init();
        });
    }
};

var controller = {
    init: function() {
        leftPanelMainModel.init();
    }
};

controller.init();