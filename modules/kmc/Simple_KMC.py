import numpy as np
import matplotlib.pyplot as plt
import numpy.random as ran
import plotly.graph_objs as go
import math
import os
import glob
import matplotlib.gridspec as gridspec
import random
import matplotlib.colors as colors

NA = 10000
NB = 0
NC = 0
Ntot_init = NA+NB+NC
NAvec = []
NBvec = []
NCvec = []
Timevec = []
NA_exact = []
NB_exact = []
NC_exact = []

NA_newexact = []
NB_newexact = []
NC_newexact = []

NA_ss = []
NB_ss = []
NC_ss = []

plot_ss = 0
plot_exact = 1
plot_kmc = 1

# A <==> B <==> C

#A --> B
#r1 = k1*NA
k1 = 100.0

#B --> A
#rb1 = kb1*NB
kb1 = 10.0

#B --> C
#r2 = k2*NB
k2 = 200.0

#C --> B
#rb2 = kb2*NC
kb2 = 10.0

alpha = k2/k1
K1 = k1/kb1
K2 = k2/kb2

Time = 0.0

Timevec.append(Time)
NAvec.append(NA)
NBvec.append(NB)
NCvec.append(NC)
NA_exact.append(NA)
NB_exact.append(NB)
NC_exact.append(NC)
NA_newexact.append(NA)
NB_newexact.append(NB)
NC_newexact.append(NC)
NA_ss.append(NA)
NB_ss.append(NB)
NC_ss.append(NC)
steps = 0
store_data = 1000


while Time < 1000.0 and steps<100000:
    Ratelist = []
    r1 = k1*NA
    rb1 = kb1*NB
    r2 = k2*NB
    rb2 = kb2*NC
    
    Ratelist.append(0)
    Ratelist.append(r1)
    Ratelist.append(rb1)
    Ratelist.append(r2)
    Ratelist.append(rb2)
    Ratelist = np.cumsum(Ratelist)
    Totalrate = Ratelist[-1]
    
    q = random.random()*Totalrate
    Waitingtime = -math.log(random.random())/Totalrate
    
    if q < Ratelist[1]:
        NA -=1
        NB+=1
        
    elif q < Ratelist[2]:
        NB -=1
        NA+=1
        
    elif q < Ratelist[3]:
        NB -=1
        NC +=1
        
    elif q < Ratelist[4]:
        NC -=1
        NB +=1
    
    Time += Waitingtime
    steps += 1
    #print Time, steps
    if steps%store_data ==0:
        Timevec.append(Time)
        NAvec.append(NA)
        NBvec.append(NB)
        NCvec.append(NC)
        NA_exact.append((math.exp(-(1.0/2.0)*(k1+k2+kb1+kb2+math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2))))*Time)*(-(-1+math.exp(math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))*Time))*k1*(-k2*(-k1+k2+kb1)+(k1-2*k2+kb1)*kb2-kb2**2.0)+k1*k2*math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))+math.exp(math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))*Time)*k1*k2*math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))+k1*kb2*math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))+math.exp(math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))*Time)*k1*kb2*math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))+2.0*math.exp(1.0/2.0 * (k1+k2+kb1+kb2+math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2))))*Time)*kb1*kb2*math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2))))*(NA+NB+NC))/(2.0*(kb1*kb2+k1*(k2+kb2))*math.sqrt((k1+k2+kb1+kb2)**2.0-4.0*(kb1*kb2+k1*(k2+kb2)))))
        NB_exact.append((math.exp(-(1.0/2.0)*(k1+k2+kb1+kb2+math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2))))*Time)*k1*((-1+math.exp(math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))*Time))*(k1*(2.0*k2+kb2)-kb2*(k2-kb1+kb2))-kb2*math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))-math.exp(math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))*Time)*kb2*math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))+2.0*math.exp(1.0/2.0*(k1+k2+kb1+kb2+math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2))))*Time)*kb2*math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2))))*(NA + NB + NC))/(2.0*(kb1*kb2+k1*(k2+kb2))*math.sqrt((k1+k2+kb1+kb2)**2-4*(kb1*kb2+k1*(k2+kb2)))))
        NC_exact.append(Ntot_init-NA_exact[-1]-NB_exact[-1])
        E1 = 1.0 + 1.0/K1 + alpha + alpha/K2
        E2 = alpha*(1.0+1.0/(K1*K2)+1.0/K2)
        D1 = (-E1+math.sqrt(E1**2-4*E2))/2.0
        D2 = (-E1-math.sqrt(E1**2-4*E2))/2.0
        
        C1 = (-1-D2 + alpha/(K1*K2*D1))/(D1-D2)
        C2 = (1+D1-alpha/(K1*K2*D2))/(D1-D2)
        C3 = (alpha/D1)/(D1-D2)
        C4 = (-alpha/D2)/(D1-D2)
        Theta = k1*Time
        
        NA_newexact.append(Ntot_init* (C1*math.exp(D1*Theta)+C2*math.exp(D2*Theta)+alpha/(K1*K2*E2)))
        NC_newexact.append(Ntot_init* (C3*math.exp(D1*Theta)+C4*math.exp(D2*Theta)+alpha/(E2)))
        NB_newexact.append(Ntot_init-NA_newexact[-1]-NC_newexact[-1])
        
        
        
        
        NA_ss.append(((math.exp(((-k1*k2-kb1*kb2)*Time)/(k2+kb1))*k1*k2+kb1*kb2)*Ntot_init)/(k1*k2+kb1*kb2))
        NB_ss.append((k1*(math.exp(((-k1*k2-kb1*kb2)*Time)/(k2+kb1))*k1*k2+k2*kb2-math.exp(((-k1*k2-kb1*kb2)*Time)/(k2+kb1))*k2*kb2+kb1*kb2)*Ntot_init)/((k2+kb1)*(k1*k2+kb1*kb2)))
        NC_ss.append(-(((-1+math.exp(((-k1*k2-kb1*kb2)*Time)/(k2+kb1)))*k1*k2*Ntot_init)/(k1*k2+kb1*kb2)))
        
gs = gridspec.GridSpec(1,1)


fig1 = plt.figure()
ax1 = fig1.add_subplot(gs[0])
if plot_kmc ==1:
    ax1.plot(Timevec, NAvec, 'bo', label='A, KMC solution', linewidth = 0.0)
    ax1.plot(Timevec, NBvec, 'ro', label='B, KMC solution', linewidth = 0.0)
    ax1.plot(Timevec, NCvec, 'go', label='C, KMC solution', linewidth = 0.0)

if plot_exact ==1:
    ax1.plot(Timevec, NA_newexact, 'b', label='A, exact solution', linewidth = 2.0)
    ax1.plot(Timevec, NB_newexact, 'r', label='B, exact solution', linewidth = 2.0)
    ax1.plot(Timevec, NC_newexact, 'g', label='C, exact solution', linewidth = 2.0)

if plot_ss ==1:
    ax1.plot(Timevec, NA_ss, 'bs', label='A, steady-state approximation', linewidth = 0.0)
    ax1.plot(Timevec, NB_ss, 'rs', label='B, steady-state approximation', linewidth = 0.0)
    ax1.plot(Timevec, NC_ss, 'gs', label='C, steady-state approximation', linewidth = 0.0)

#ax1.set_yscale('log')
ax1.set_ylabel('Number of molecules', fontsize = 18)
ax1.set_xlabel('Time (s)', fontsize = 18)
#ax1.set_ylim([1E-16,1E-5])
ax1.legend(loc=0,fontsize = 14)

plt.show()
