const fs = require('fs');

function findTrianglesAndClique(connections) {
    // Build adjacency list
    const graph = new Map();
    for (let [a, b] of connections) {
        if (!graph.has(a)) graph.set(a, new Set());
        if (!graph.has(b)) graph.set(b, new Set());
        graph.get(a).add(b);
        graph.get(b).add(a);
    }
    
    // Part 1: Find triangles with 't'
    const triangles = new Set();
    for (let [node, neighbors] of graph) {
        for (let n1 of neighbors) {
            for (let n2 of neighbors) {
                if (n1 >= n2) continue; // Skip duplicates
                if (graph.get(n1).has(n2)) {
                    const triangle = [node, n1, n2].sort();
                    triangles.add(triangle.join(','));
                }
            }
        }
    }
    
    const tTriangles = Array.from(triangles)
        .filter(triangle => triangle.split(',').some(comp => comp.startsWith('t')))
        .length;
    
    console.log(`Part 1 - Triangles with 't': ${tTriangles}`);
    
    // Part 2: Find largest clique
    const nodes = Array.from(graph.keys());
    for (let size = nodes.length; size > 1; size--) {
        for (let i = 0; i < nodes.length; i++) {
            const clique = new Set([nodes[i]]);
            for (let j = i + 1; j < nodes.length; j++) {
                const node = nodes[j];
                if (Array.from(clique).every(n => graph.get(node).has(n))) {
                    clique.add(node);
                }
                if (clique.size === size) {
                    if (Array.from(clique).every(a => 
                        Array.from(clique).every(b => 
                            a === b || graph.get(a).has(b)
                        )
                    )) {
                        const password = Array.from(clique).sort().join(',');
                        console.log(`Part 2 - LAN party password: ${password}`);
                        return [tTriangles, password];
                    }
                }
            }
        }
    }
    
    return [tTriangles, null];
}

function main() {
    try {
        // Read input
        const input = fs.readFileSync('./src/input.txt', 'utf8');
        const connections = input.trim()
            .split('\n')
            .map(line => line.split('-'));
        
        // Solve both parts
        const [triangles, password] = findTrianglesAndClique(connections);
        
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

main();