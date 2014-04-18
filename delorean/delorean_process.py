


f = open('../proc/deloreans.csv','r')
o = open('../proc/delClean.csv','w')
labels = ['record_id', 'vin_id', 'plate_id',
          'TBD', 'owner_type', 'start_odom', 'start_date', 'end_date',
          'insp_match',
          'ovrlp_days', 'daysbtnins', 'ovrlp_pct', 'mi_per_day',
          'muni_id', 'veh_zip', 'insp_year', 'model_year', 'make', 
          'model', 'veh_type', 'mcycle', 'hybrid', 'curbwt', 'msrp',
          'mpg2008', 'fuel', 'mpg_adj', 'gal_per_day',
          'co2eqv_day', 'q1_2008',	'q2_2008', 'q3_2008', 'q4_2008',
          'q1_2009', 'q2_2009', 'q3_2009', 'q4_2009',
          'q1_2010', 'q2_2010', 'q3_2010', 'q4_2010', 'q1_2011',
          'q2_2011', 'q3_2011', 'q4_2011']


vin_id = labels.index('vin_id')
veh_zip = labels.index('veh_zip')
muni_id = labels.index('muni_id')
model_year = labels.index('model_year')
mi_per_day = labels.index('mi_per_day')
daysbtnins = labels.index('daysbtnins')
ovrlp_pct = labels.index('ovrlp_pct')
start_date = labels.index('start_date')
start_odom = labels.index('start_odom')
make = labels.index('make')
makes= {}

vehicles = {}
lineRaw = f.readline()

while lineRaw != '':
    
    line = lineRaw.split(',')
    key = line[vin_id]

    
    if key in vehicles:
        vehicles[key].append(line)
    else:
        vehicles[key] = [line]

    
    if (line[start_odom] != '') and (float(line[mi_per_day]) < 70):
        o.write(lineRaw)
    lineRaw = f.readline()

nullCount = 0
def prettyRec(r):
    global nullCount
    mpd = r[mi_per_day]
    days = r[daysbtnins]
    
    start = r[start_date]
    sodom = r[start_odom]
    # z = r[veh_zip]
    # if int(z) != 0:
    #    print '\t', z
    if sodom == '':
        nullCount +=1
        #return
    print '\t', mpd, '\t', days, '\t', start, '\t', sodom ,'\t', r[ovrlp_pct], '\t', r[muni_id]
def prettyPrint(v):
    print v[0][vin_id],' ', v[0][model_year]
    for i in range(len(v)):
        
        prettyRec(v[i])
        
    
        
        
        
print len(vehicles), " Deloreans in MA"
# ks = vehicles.keys()
# ks.sort()
# for k in ks:
#     print k

colors = {'6256330': 'red', '794855':'orange', '1739967':'cyan',
          '3327325': 'lightgreen', '6356198': 'magenta'}

def getColor(vin):
    if vin in colors:
        return colors[vin]
    else:
        return "grey"
    
years = {}
maxOd = []
scat = []
for key in vehicles:
    prettyPrint(vehicles[key])
    y = vehicles[key][0][model_year]
    if y in years:
        years[y] = years[y]+1
    else:
        years[y] = 1
    maxOd.append(max([0] +[int(v[start_odom]) for v in vehicles[key] if v[start_odom] != '']))
    scat = scat + [(v[mi_per_day], v[daysbtnins], getColor(v[vin_id])) for v in vehicles[key] if v[start_odom] != '' if float(v[mi_per_day]) < 70]


print scat
    
print "null count ", nullCount
print years
maxOd.sort()
maxOd.reverse()
print maxOd
import matplotlib.pyplot as plt
import numpy as np
# ys = years.keys()
# ys.sort()
# ind = np.arange(len(ys))
# data = [years[y] for y in ys]
# plt.bar(ind, data)
# plt.show()

# ind = np.arange(len(maxOd))
# data = maxOd
# plt.bar(ind, data, color='green')
# plt.ylabel("Most Recent Odometer Data")
# #plt.title("Most MA Deloreans are low mileage")
# plt.xlabel("20 Deloreans of MA")
# plt.show()

# plot a scatter of average daily mileage versus number of days

# plt.scatter(x = [float(x[1]) for x in scat],
#             y = [float(x[0]) for x in scat],
#             color = [x[2] for x in scat])
# plt.xlabel('Days Between Inspections used for average mileage calculation')
# plt.ylabel('Average Daily Mileage')
# (x1, x2, y1, y2) = plt.axis()
# plt.axis((x1,x2, 0, y2))
# plt.show()


    


    
