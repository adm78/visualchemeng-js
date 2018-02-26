#!/usr/bin/python

import numpy as np


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

n = 10.0                          # number of nodes
delta_x = l/n                     # finite difference x
t_0 = 0.0                         # initial time
t_end = 1.0                       # end time
n_steps = 100.0                   # number of time steps
delta_t = t_end/ n_steps          # time step
q = alpha * delta_t / delta_x **2 # forward step parameter, must be < 0.5 for stable solutions

############################################################
############################################################
############################################################

 # INITIAL CONDITIONS

dirichlet = 10.0                 # dirichlet boundary condition
dirichlet_end = 2.0
f0 = 1.0                          # initial temperature constant
t = t_0 + delta_t                 # set loop first time step
phi_0 = np.ones(n) * f0           # initial temperature vector
phi_0[0] = dirichlet
phi_0[-1] = dirichlet_end
############################################################
############################################################
############################################################

 # BUILD RESULTS STORAGE
results = {}                      # results matrix dict

############################################################
############################################################
############################################################

 # ALGORITHM

def main(results, phi, t, q):
    results[t] = phi
    # Execute main code, evaluating temperature across bar
    # from intial time until end time and returning results
    # as a dictionary of matrices
    
    while t <= t_end:  
        t+= delta_t
        phi_old = phi

        # Loop through and update the matrix with the new values, noting
        # the boundaries are fixed in this case (first/last never get
        # updated)
         
        for i in range(1,len(phi_old)): # very non-pythonic...
            phi[i] = q*(phi_old[i+1] + phi_old[i-1]) + (1-2*q)*phi_old[i]
            
        results[t] = phi

    return results

############################################################
############################################################
############################################################

results = main(results,phi,t,q)
print results
