#!/home/zia/anaconda/bin/python

import xlrd
import json

xfile = "proc/ModelResults.xlsx"
ofile = "vizSubmission/data/varNames.json"

workbook = xlrd.open_workbook(xfile)
#print workbook.sheet_names()

# define column contents:
names = ['varName','shortName', 'longName', 'description',
         'source','units','mean','median',
         'min','max', 'stdDev']

var_names = [
    'pop10', 'HHIncBG', 'OwnPct','exit_dist',
    'ChildPct', 'SeniorPct', 
    
    'total_emp','pbld_sqm','prow_sqm',
    'pttlasval','ppaved_sqm', 'far_agg',
    'intsctnden','sidewlksqm',
    'schwlkindx',
    'SLD_D4c']



def dataFromWorksheet(worksheet):
    num_rows = worksheet.nrows
    data = {}
    for r in range(1,num_rows): # ignore first and last
        row = worksheet.row_values(r)
        cols = zip(names, row[0:len(names)])
        d = {}
        for c in cols:
            d[c[0]] = c[1]
        data[d['varName']] = d
    return data

worksheet = workbook.sheet_by_name("Table of Vars")
output = dataFromWorksheet(worksheet)
print output['MPDPP']



with open(ofile, 'w') as outfile:
    outfile.write(json.dumps(output))
