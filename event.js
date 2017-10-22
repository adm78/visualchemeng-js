// This is a general container class that can store information about the
// type, time and particles involved in a collision event

function Event(ct,t,p1_index,p2_index=null,wall=null) {

  // here-in lies the constructor
  this.wc_log = false; // is it wall collision (otherwise binary particle col)
  this.t = t;
  this.p1_index = p1_index;
  this.p2_index = p2_index;
  this.wall = wall;
  if (ct==="w") {
    this.wc_log = true;
  };

}
