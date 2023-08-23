## Features
* ~~Add click on node functionality~~
* ~~Add user controlled number of links for initial graph~~
* ~~Add refresh links button (add connections between already rendered pages)~~
* ~~Add Drag and Drop functionality~~ **Fix Drag Drop bugginess** <- caused by node not staying when mouse stops moving (before drop)
* ~~Add error checking for invalid wiki pages (when directly drawing graph)~~
* Add tooltips and change buttons to icons
* Add dynamic node sizing based on number of connections

## Brainstorm
* ~~Figure out how to display wiki search results~~ <- added modal
* ~~**Figure out how to refresh graph**~~ <- just had to change graph reference
---
### Add new node function
* Problems
  * Need to spread nodes evenly around center
  * Need to not overcrowd (limit number of nodes around one center)
* Solutions
  * Created alg to spread points evenly around node's largest free sector
  * Created global variable to control how many nodes can surround a center