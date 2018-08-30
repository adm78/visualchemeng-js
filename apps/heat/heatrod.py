#!/usr/bin/python

import numpy as np
import matplotlib.pyplot as plt

############################################################
############################################################
############################################################

 # A simple python script using the finite difference method
 # to solve a simple heat equation problem

############################################################
############################################################
############################################################

 # MATERIAL PARAMETERS

l = 1.0                           # rod length
alpha = 0.01                      # rod diffusivity

############################################################
############################################################
############################################################

 # SIMULATION PARAMETERS

n = 50                            # number of nodes
delta_x = l/n                     # finite difference x
t_0 = 0.0                         # initial time
t_end = .5                       # end time
n_steps = 20.0                   # number of time steps
delta_t = t_end/ n_steps          # time step
q = alpha * delta_t / delta_x **2 # forward step parameter, must be < 0.5 for stable solutions

############################################################
############################################################
############################################################

 # INITIAL CONDITIONS

dirichlet = 10.0                  # dirichlet boundary condition x=0
dirichlet_end = 0.50              # End boundary condition x=L
f0 = 1.0    
phi_0 = np.full(n, f0)            # initial temperature vector
phi_0[0] = dirichlet
phi_0[-1] = dirichlet_end

############################################################
############################################################
############################################################

 # ALGORITHM

def main(phi, t, q, delta_t):    
    
    # Execute main code, evaluating temperature across bar
    # from intial time until end time and returning results
    # as a dictionary of matrices
    
    x = np.arange(0,l,delta_x)
    while t <= t_end:
        plotter(phi,x,t)
        t += delta_t
        phi_old = phi

        # Loop through and update the matrix with the new values, noting
        # the boundaries are fixed in this case (first/last never get
        # updated)
         
        for i in range(1,len(phi_old)-1): # very non-pythonic...
            phi[i] = q*(phi_old[i+1] + phi_old[i-1]) + (1-2*q)*phi_old[i]
        


############################################################
############################################################
############################################################

 # PLOT GRAPH FOR 5 TIME STEPS

def plotter(phi,x,t):
    plt.plot(x,phi,label = r'$t = %2.02f$' % float(t))


############################################################
############################################################
############################################################

 # PLOT GRAPH FOR n_steps TIME STEPS

main(phi_0,t_0, q, delta_t)
plt.legend()

plt.show()
