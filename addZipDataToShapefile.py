#!/usr/bin/env python
# -*- coding: utf-8 -*-


import shapefile
import csv
import math

# instructions: to transfer data from .csv to shapefile 
# add the field name to the fields list
# to add a computed value, follow example of VehPP1864
# add the field, then compute and add the data for each shape

sfBase = "data/companion/Spatial/ma_zipcodes_poly.shp"

csvfile = open("proc/GridAnalysisFinal.csv",'r')
data = csv.DictReader(csvfile) #read the data in as a dictionary
# Could work with only what we care about if too slow:

# TODO, add these other fields?
# Process MPDPP better to account for population?
myFields = ['MPDPP',
            'ChildPct',
            'SeniorPct',
            'OwnPct',
            'pop10',
            'hh10',
           # 'total_emp',
           # 'pbld_sqm',
           # 'prow_sqm',
           # 'pttlasval',
           # 'ppaved_sqm',
           # 'far_agg',
            'intsctnden',
            'sidewlksqm',
            'schwlkindx',
            'exit_dist', 
            'HHIncBG',
            #'SLD_D4c',
            'co2eqv_day', 
]

# organize all data by zip code:
def sortByZip(data):
    zips = {}

    for row in data:
        #ignore anything that can't resolve to int
        try:
            z = int(row["zip_code"])
        except ValueError:
            continue
        if z in zips:
            zips[z].append(row)
        else:
            zips[z] = [row]
        #break;
    return zips


def simpleAverage(name, num_grids, array, m_out):
    # updates the ouptput map with the averaged signal
    # of the same name
    a_string = [r[name] for r in array]
    #drop any NAs
    a_raw = [float(s) for s in a_string if s!= 'NA']
    m_out[name] = sum(a_raw)/num_grids
    return
    
        
zips = sortByZip(data)
# note zips keys are "2144", missing leading zero
def summarizeZipData(zips):
    zipsSummary = {}
    for zkey in zips:
        z = zips[zkey]
        zs = {} # zip summary output map
        num_grids = len(z)
        zs['num_grids'] = num_grids

        # populate with a simple dummy average
        for f in myFields:
            simpleAverage(f, num_grids, z, zs)

        # overwrite simple average with better average 
        # in a few cases:

        # MPDPP
        
        pop10_raw = [float(r['pop10']) for r in z]
        pop10_tot = sum(pop10_raw)
        ChildPct_raw = [float(r['ChildPct']) for r in z]
        numChildren = sum([cp*pr for (cp, pr) in zip(ChildPct_raw, pop10_raw)])
        zs['ChildPct'] = numChildren/pop10_tot
        
        #SeniorPct
        ChildPct_raw = [float(r['SeniorPct']) for r in z]
        numChildren = sum([cp*pr for (cp, pr) in zip(ChildPct_raw, pop10_raw)])
        zs['SeniorPct'] = numChildren/pop10_tot

        # special case municipal
        zs['municipal'] = z[0]['municipal']
        zipsSummary[int(z[0]['zip_code'])] = zs
        ###break
    return zipsSummary

zipsSummary = summarizeZipData(zips)
print zipsSummary


sf = shapefile.Editor(sfBase)
print sf
def addField(name, widthMinusPrecision,precision = 3, default = 0): #assumes precision of 1
    sf.field(name, 'N', widthMinusPrecision+precision+1, precision)
    # Zero pad new data all the way down to keep the shape file "in shape" :)
    for r in sf.records:
        r.append(default)
    return

def addStringField(name):
    sf.field(name, 'C', 12, 0)
    # Empty pad new data all the way down to keep the shape file "in shape" :)
    for r in sf.records:
        r.append("") # can't over write, so don't do this
    return

def p5(n):
    return float('%0.5f'%n)

for f in myFields:
    addField(f, 8,5, -1)

addStringField('municipal')

fieldMap = {}
for i in range(len(sf.fields)):
    #   print sf.fields[i][0]
    fieldMap[sf.fields[i][0]] = i-1


print 'fieldMap is: ', fieldMap
# Add actual data to shapefile

zipIndex = fieldMap['zip']

missing = 0
naCount = 0
for r in sf.records:
    #for each zip code poly
    zipId = int(r[zipIndex])
    ## DO WHAT THEY DO IF THEY MATCH
    if zipId in zipsSummary:
        print zipsSummary[zipId]
        zs = zipsSummary[zipId]
        for f in myFields:
            metric = zs[f]
            r[fieldMap[f]] = p5(float(metric))
        r[fieldMap['municipal']] = zs['municipal']
    else:
        missing +=1
        print "zip not found", zipId, missing

# and save as new shapefile with data.
sf.save('proc/zips_data')



