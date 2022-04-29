#!/usr/bin/env python

import pydot
import os
from sys import argv

assert argv[1]

G = pydot.Graph("server", graph_type="digraph")
PREFIX = "https://github.com/musikid/chwitter/blob/main/server/src"

for root, dirs, files in os.walk(argv[1]):
    for subdir in dirs:
        node = pydot.Node(subdir)
        G.add_node(node)
        edge = pydot.Edge(root.split("/")[-1], subdir)
        G.add_edge(edge)

    for file in files:
        name = os.path.join(root, file)
        node = pydot.Node(name, label=file)
        G.add_node(node)
        edge = pydot.Edge(root.split("/")[-1], name)
        G.add_edge(edge)

print(G)
