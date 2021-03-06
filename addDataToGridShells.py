#!/usr/bin/env python
# -*- coding: utf-8 -*-


import shapefile
import csv
import math

#instructions: to transfer data from .csv to shapefile 
# add the field name to the fields list
# to add a computed value, follow example of VehPP1864
# add the field, then compute and add the data for each grid

sfBase = "proc/grid_250m_shell_smaller"

csvfile = open("proc/GridAnalysis_v2.csv",'r')
data = csv.DictReader(csvfile) #read the data in as a dictionary

# first figure out what grids we want to keep
def getGridsToKeep():
    grid_ids = {}
    for row in data:
        # is using a dictionary stupid here? more storage space but faster lookups
        grid_ids[row["grid_2010_q2_g250m_id"]]= row
    return grid_ids


keep_grids = getGridsToKeep()
#print keep_grids

sf = shapefile.Editor(sfBase)

def addField(name, widthMinusPrecision,precision = 3, default = 0): #assumes precision of 1
    sf.field(name, 'N', widthMinusPrecision+precision+1, precision)
    # Zero pad new data all the way down to keep the shape file "in shape" :)
    for r in sf.records:
        r.append(default)
    return

def p5(n):
    return float('%0.5f'%n)
myFields = ['MPDPP', 'pass_veh', 'best_geo', 
            'mipdaybest', 'co2eqv_day', 
            'pop10','pop1864_10', 'VehPP', 
            'schwlkindx','sidewlksqm',
            'ChildPct', 'SeniorPct', 
            'intsctnden', 'exit_dist', 'total_emp']
for f in myFields:
    addField(f, 8,5, -1)
addField('VehPP1864', 8, 5, -1)

fieldMap = {}
for i in range(len(sf.fields)):
    #   print sf.fields[i][0]
    fieldMap[sf.fields[i][0]] = i-1


print fieldMap
# Add actual data to shapefile

gridIndex = fieldMap['g250m_id']
print gridIndex
missing = 0
naCount = 0
for r in sf.records:
    gridId = str(r[gridIndex])
    #print gridId
    if gridId in keep_grids:
        g = keep_grids[gridId]
        for f in myFields:
            mpdpp = g[f]
            if mpdpp != "NA":
                r[fieldMap[f]] = p5(float(mpdpp))
            else:
                naCount +=1
                print "could not convert", mpdpp, gridId, naCount
        #vehpp:
        pass_veh = float(g['pass_veh'])
        pop1864 = float(g['pop1864_10'])
        if isinstance(pass_veh, float) and isinstance(pop1864, float):
            if pop1864 < 1:
                vehpp = pass_veh
            else:
                vehpp = pass_veh/pop1864
            r[fieldMap['VehPP1864']] = p5(vehpp)
        
    else:
        missing +=1
        print "grid not found", gridId, missing

# and save as new shapefile with data.
sf.save('proc/grid_250m_shell_smaller_data')



