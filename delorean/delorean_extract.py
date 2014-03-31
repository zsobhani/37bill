

f = open('../data/rae_public_noheader.csv', 'r')
o = open('../proc/deloreans.csv','w')


make = 17
makes= {}
line = f.readline()
while line != '':
    

    make_key = line.split(',')[make]
    
    # if make_key in makes:
    #     makes[make_key]+=1
    # else:
    #     makes[make_key] = 1

    if make_key == "Delorean":
        print line
        o.write(line)
        
    line = f.readline()
    #o.write(line)
for m in makes.keys():
    o.write(m + ' ' + str( makes[m]) + '\n')
print makes

#Big Dog
#Delorian
#Rhino

#MIT solor car?
# 

    
