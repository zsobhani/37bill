#!/home/zia/anaconda/bin/python

import xlrd
import json

xfile = "proc/ModelSimulation.xlsx"
ofile = "mapViz/leafbased/data/ModelSimulation.json"

workbook = xlrd.open_workbook(xfile)
print workbook.sheet_names()

# define column contents:
c_intervals = 0
c_MPDPP = 1
c_modelOut = 2  # the unnamed thing we care about
c_aveMetric = 3 # the average of the sheet name parameter 
c_count = 4     # for histogram purposes, how many grids are in this bin.

sheet_names = ['sidewalks', 'Intersections', 'Pop10']
sheet_vars = ['sidewlksqm', 'intsctnden', 'pop10']


def dataFromWorksheet(worksheet):
    num_rows = worksheet.nrows
    print num_rows
    data = []
    for r in range(1,num_rows-1): # ignore first and last
        row = worksheet.row_values(r)
        d = {'x': row[c_aveMetric],
             'count': row[c_count],
             'yAct': row[c_MPDPP],
             'yModel': row[c_modelOut],
         }
        data.append(d)
    return data

def getStartEndRanges(worksheet):
    int_strings = worksheet.col_values(c_intervals, 1, -1)
  
    #get the full range data was calculated over:
    x_start = float(int_strings[0].split('-')[0])
    x_end = float(int_strings[-1].split('-')[1])
    print x_start, x_end
    return (x_start, x_end, int_strings)

output = {}
for s,v in zip(sheet_names, sheet_vars):
    print s,v
    worksheet = workbook.sheet_by_name(s)
    d = dataFromWorksheet(worksheet)
    range = getStartEndRanges(worksheet)
    output[v] = {'data': d,
                 'start': range[0],
                 'end': range[1],
                 'ranges': range[2],
             }
    break # only do the first one since the others are not consistently formatted yet

print output

with open(ofile, 'w') as outfile:
    outfile.write(json.dumps(output))
