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
 # EXAMPLE VALUES USED FOR PURE IRON https://www.engineersedge.com/properties_of_metals.htm
 
l = 1.0                           # rod length
rho = 7897.0                      # rod density
c = 452.0                         # rod heat capacity
k = 71.8                          # rod thermal conductivity

############################################################
############################################################
############################################################

 # SIMULATION PARAMETERS

n_elem = 100                      # number of elements
t_0 = 0.0                         # initial time
t_end = 100.0                        # end time
n_steps = 20.0                    # number of time steps
delta_t = t_end/ n_steps          # time step

############################################################
############################################################
############################################################

 # INITIAL CONDITIONS

dirichlet = 10.0                  # dirichlet boundary condition x=0
dirichlet_end = 0.50              # End boundary condition x=L
f0 = 1.0    
phi_0 = np.full(n_elem+1, f0)            # initial temperature vector
phi_0[0] = dirichlet
phi_0[-1] = dirichlet_end

############################################################
############################################################
############################################################

 # BAR OBJECT

class Bar(object):
    
    def __init__(self,l,rho,c,k,n_elem):
        self.l   = 1.0
        self.rho = 1.0 
        self.c   = 1.0
        self.k   = 1.0
        self.elem = n_elem
        self.nodes = self.elem + 1
        self.phi = np.ones(self.nodes)
        
    def get_alpha(self):
        return k / rho / c
 
    def get_init_mesh(self, phi_init):
        self.phi *= phi_init
        return self.phi
               
    def set_temp(self, phi_new):
        self.phi = phi_new

    def get_temp(self):
        return self.phi

class Solver():
    
    def __init__(self,delta_t,delta_x):
        self.delta_t = delta_t
        self.delta_x = delta_x
        
    def solve_ftcs(self,phi_old, bar):
        phi = phi_old
        q = bar.get_alpha() * self.delta_t / self.delta_x**2
        for i in range(1,len(phi_in)-1):
            phi[i] = q*(phi_old[i+1] + phi_old[i-1]) + (1-2*q)*phi_old[i]
        return phi
            
############################################################
############################################################
############################################################

 # ALGORITHM

def main(phi, t, delta_t, l,rho,c,k,n_elem):    
    
    # Execute main code, evaluating temperature across bar
    # from intial time until end time and returning results
    # as a dictionary of matrices
    
    alpha = k / c / rho               # rod diffusivity
    delta_x = l/(n_elem)              # finite length difference
    q = alpha * delta_t / delta_x **2 # forward step parameter, must be < 0.5 for stable solutions

    bar = Bar(l,rho,c,k,n_elem)
    solver = Solver(delta_t,delta_x)
    x = [i * delta_x for i in range(0,bar.nodes)]
    print len(x), len(phi)
    while t <= t_end:
        plotter(phi,x,t)
        t += delta_t
        phi_old = phi

        # Loop through and update the matrix with the new values, noting
        # the boundaries are fixed in this case (first/last never get
        # updated)
         
        for i in range(1,bar.elem): # very non-pythonic...
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

main(phi_0, t_0, delta_t, l, rho, c, k, n_elem)
plt.legend()

plt.show()
