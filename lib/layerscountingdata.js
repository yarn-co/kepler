


/*======================= 
  
    how to get the total count in layers
    and the count per layer
=======================*/ 


Triforce.forceRebuildViewer(2)
Triforce.count

Triforce.forceRebuildViewer(4)
Triforce.count

6 + 12 = 18

0 + (12*0) + 6 = 6
6 + (12*1) + 6 = 24
24 + (12*2) + 6 = 54
54 + (12*3) + 6 = 96
96 + (12*4) + 6 = 150

// total counts
// & per level
p = 0
t = [p]
per = [p]
var len = 20;
for (var i = 0; i < len; i++) {
	p = p + (12*i) + 6
	l = (12*i) + 6
	t.push(p)
	per.push(l)
};

// tada!

// total
[0, 6, 24, 54, 96, 150, 216, 294, 384, 486, 600, 726, 864, 1014, 1176, 1350, 1536, 1734, 1944, 2166, 2400]

// per level
[0, 6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234]


so this old data shows 
version 1

a.data.trixels.length = 864
amountOfLayers 13
zoomIndex 12

the count shows amountOfLayers is layer 12 in the proper array minus the 0 array
so the IN would be amountOfLayers - 1
as the zoom is correct
lets test!


