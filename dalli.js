$(document).ready(function(){
  //Intial page rendering instructions
  $('.vline').height(0);

  //Variable for controlling the delay in sequential animation steps.
  var animationLength = 700;

  //Percentages for animating the wrapper bar appropriately, beginning from the centre of the vline that extends to it.
  var margins = {
    a:'6.55%',
    b:'23.8%',
    c:'41.17%',
    d:'58.55%',
    e:'75.8%',
    f:'93.17%',
    //i and j are for the master nodes position at columns two and seven respectively.
    i: '36.88%',
    j: '80.2%'
  };
  

  //General click function for nodes that are not already active.
  $('.node').click(function(){
    //Deactives node click function to prevent a new animation from starting before the current one is complete.
    $('.node').not('.terminal').css("pointer-events", "none");
    setTimeout(function(){$('.node').css("pointer-events", "auto");},750+animationLength);
    
    //Parse id of new branch in preparation for animation
    $(this).addClass('active');
    var nodeId = this.id;
    var extendDetails = parseId(nodeId);

    //Check for active tree branches and retract them before forming a new branch.
    //extend is the callback to extend branch once animation is complete

    checkSiblings(this, extendDetails);
  });

  //Checking for active sibling branch
  function checkSiblings(clickedNode, extendDetails){
    var hasActiveSibling = $(clickedNode).parent().siblings().children().hasClass('active');

    if(hasActiveSibling){
      var activeSiblingId = $(clickedNode).parent().siblings().children('.active').attr('id');
      var siblingDetails = parseId(activeSiblingId);

      //Check if active sibling has active children
      checkChildren(activeSiblingId, siblingDetails, extendDetails);
    }
    else {
      extend(extendDetails);
    }
  }
  //Check if an active node has active child
  function checkChildren(activeSiblingId, parentDetails, extendDetails){
    //Redundant repition of code to make it more readable
    var targetDetails = parseId(activeSiblingId);
    targetDetails[1] = parseInt(targetDetails[1])+1; //adding 1 to treeLevel targets children nodes.
    targetDetails[0] = targetDetails[1]+ 'a'; //updating coordinate at targetDetails[0] to reflect the new level. Default column target set to 'a'.
    var targetChild = "#n"+ targetDetails[0];
    var hasActiveChild = $(targetChild).parent().parent().children().children().hasClass('active');
    
    //Recursive control flow to retract children branches before parent branches.
    //Need to add appropriate lags so that parent only starts animating once child animation is complete.
    if(hasActiveChild){
      var activeChildId = $(targetChild).parent().parent().children().children('.active').attr('id');
      var isTerminal = $('#'+activeChildId).hasClass('terminal');
      var childDetails = parseId(activeChildId);
      $("#"+activeChildId).removeClass('active');

      //Terminal nodes have no children, so no need to retract on childDetails. 'If' statement reduces the lag.
      if(isTerminal){
        retract(parentDetails);
        setTimeout(function(){extend(extendDetails);}, animationLength);
      }
      // else if (true) {
      //   checkChildren(activeChildId, childDetails, extendDetails)
      // };
      else{
        retract(childDetails);
        setTimeout(function(){retract(parentDetails);}, animationLength);
        setTimeout(function(){extend(extendDetails);}, animationLength*2);
      }
    }

    else{
      retract(parentDetails);
      setTimeout(function(){extend(extendDetails);}, animationLength);
    }
  }

  function extend(details){
    branchOutAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
  }

  function parseId(id){
    var treeCoordinate = id.substring(1,3); //gets exact coordinate of the node: eg. 2c
    var treeLevel = id.substring(1,2); //gets only the level or row of the node in the tree: eg. 2
    return [treeCoordinate,treeLevel];
    }

  function retract(details) {
    retractAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
    
    //Remove 'active' class after retract animation happens.
    $('#n'+details[0]).removeClass('active');
  }
        
  
  //Branching Out animation occurs over 1000 ms
  function branchOutAnimation (linker, wrapper, vline){

    if ($(wrapper).hasClass('active') === false) {
      
      $(linker).addClass('active');
      $(wrapper).addClass('active');
      $(vline).addClass('active');

      //Check if wrapper is already active or not, and adjust margin if latter.
      var treeCol = linker.substring(3,4);
      var wrapperPosition = margins[treeCol];
      $(wrapper).css({"margin-left":wrapperPosition});

      //Animation sequence
      $(linker).animate({height:"100%"}, 300);
      setTimeout(function(){$(wrapper).animate({"margin-left": "0", "width": "100%"}, 450);}, 300);
      setTimeout(function(){$(vline).animate({height:"100%"}, 250);}, 750);
    } 
  }
  
  //Retracting animation occurs over 700 ms
  function retractAnimation(linker, wrapper, vline){
    $(linker).removeClass('active');
    $(wrapper).removeClass('active');
    $(vline).removeClass('active');

    var treeCol = linker.substring(3,4);
    var wrapperPosition = margins[treeCol];

    $(vline).animate({height:"0%"}, 200);
    setTimeout(function(){$(wrapper).animate({"margin-left":wrapperPosition, "width": "0"}, 350);}, 200);
    setTimeout(function(){$(linker).animate({height:"0"}, 150);}, 550);
  }
});

//Bugs
//Tier 2 node remains active if clicking a different tier 0 node.