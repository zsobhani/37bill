#!/usr/bin/env python
# -*- coding: utf-8 -*-


import shapefile
import csv
import math

sfBase = "data/grid_250m_shell"

csvfile = open("proc/GridAnalysis_v2.csv",'r')
data = csv.DictReader(csvfile) #read the data in as a dictionary

# first figure out what grids we want to keep
def getGridsToKeep():
    grid_ids = {}
    for row in data:
        # is using a dictionary stupid here? more storage space but faster lookups
        grid_ids[row["grid_2010_q2_g250m_id"]]= True
    return grid_ids

# Now delete all grids we don't want from the shape file

def deleteShape(n):
        del sf._shapes[n]
        del sf.records[n]
        return

keep_grids = getGridsToKeep()


sf = shapefile.Editor(sfBase)
numRecs = len(sf.records)
cnt = 0;
for i in range(numRecs-1, 0, -1):
    # delete records in reverse
    if str(sf.records[i][0]) not in keep_grids:
        #print "deleting", r[0]
        cnt+=1
        if cnt%100 == 0:
            print "deleted ", cnt, i
        deleteShape(i)

# and save as new shapefile with reduced size.
sf.save('proc/grid_250m_shell_smaller')
