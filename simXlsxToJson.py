#!/home/zia/anaconda/bin/python

import xlrd
import json

xfile = "proc/ModelSimulation2.xlsx"
ofile = "vizSubmission/data/ModelSimulation.json"

workbook = xlrd.open_workbook(xfile)
print workbook.sheet_names()

# define column contents:
c_intervals = 0
c_MPDPP = 1
c_aveMetric = 2 # the average of the sheet name parameter 
c_count = 3     # for histogram purposes, how many grids are in this bin.
c_modelOut = 4  # the unnamed thing we care about

# This order defines display order for small multiples
sheet_names = [
    # these are zia's pretty order, agnoizingly placed
    'pop10','total_emp', 'HHIncBG', 'OwnPct',
    'SeniorPct', 'ChildPct', 'pbld_sqm','pttlasval',
    'schwlkindx','sidewlksqm','ppaved_sqm','far_agg',
    'SLD_D4c','intsctnden', 'exit_dist','prow_sqm',
]
sheet_vars = sheet_names


def dataFromWorksheet(worksheet):
    num_rows = worksheet.nrows
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
    pred_val = worksheet.col_values(c_modelOut, 1, -1)
    act_val = worksheet.col_values(c_MPDPP, 1, -1)
    

  
    #get the full range data was calculated over:
    x_start = float(int_strings[0].split('-')[0])
    x_end = float(int_strings[-1].split('-')[1])
    
    ranges = {'start': x_start,
              'end': x_end,
              'intervals': int_strings,
              'minY': min(pred_val+act_val),
              'maxY': max(pred_val+act_val),
          }
    return ranges

output = []
for s,v in zip(sheet_names, sheet_vars):
    print s,v
    worksheet = workbook.sheet_by_name(s)
    d = dataFromWorksheet(worksheet)
    ranges = getStartEndRanges(worksheet)
    out = {'values': d,
                 'ranges': ranges,
                 'varName': v
             }
    output.append(out)


#print output

with open(ofile, 'w') as outfile:
    outfile.write(json.dumps(output))
