$(document).ready(function(){
  //Intial page rendering instructions
  $('.vline').height(0);
  
  //Percentages for animating the wrapper bar appropriately, beginning from the centre of the vline that extends to it.
  var margins = {
    a:'6.55%',
    b:'23.8%',
    c:'41.17%',
    d:'58.55%',
    e:'75.8%',
    f:'93.17%',
    //i and j are for the master nodes position at two and seven columns respectively.
    i: '36.88%',
    j: '80.2%'
  };
  
  //General click function for nodes that are not already active.
  $('.node').click(function(){
    $(this).addClass('active');
    //Parse id of new branch in preparation for animation
    var nodeId = this.id;
    var details = parseId(nodeId);

    //Check for active tree branches and retract them before forming a new branch.
    //Grow is the callback to extend branch once animation is complete
    checkSiblings(this, details);  
  });
  
  //Checking for active sibling branch
  function checkSiblings(clickedNode, growCB){
    var hasActiveSibling = $(clickedNode).parent().siblings().children().hasClass('active');

    if(hasActiveSibling){
      var activeSiblingId = $(clickedNode).parent().siblings().children('.active').attr('id');
      var details = parseId(activeSiblingId);
      //Check if active sibling has active children
      checkChildren(activeSiblingId, details, growCB);
    }
    else {
      grow(growCB);
    }
  }
  //Check if an active node has active child
  function checkChildren(id, siblingCB, growCB){
    //Redundant repition of code to make it more readable
    var details = parseId(id);
    details[1] = parseInt(details[1])+1; //adding 1 to treeLevel targets children nodes.
    details[0] = details[1]+ 'a'; //updating coordinate at details[0] to reflect the new level. Default column target set to 'a'.
    var targetChild = "#n"+ details[0];
    var hasActiveChild = $(targetChild).parent().parent().children().children().hasClass('active');
    
    //Recursive control flow to retract children branches before parent branches.
    //Need to add appropriate lags so that parent only starts animating once child animation is complete.
    if(hasActiveChild){
      var activeChildId = $(targetChild).parent().parent().children().children('.active').attr('id');
      console.log("I am the active child ID: " + activeChildId);
      var childDetails = parseId(activeChildId);
      $("#"+activeChildId).removeClass('active');

      retractAnimation("#l"+childDetails[0],"#w"+childDetails[1],".v"+childDetails[1]);
      setTimeout(function(){retractSibling(siblingCB);}, 1150);
      setTimeout(function(){grow(growCB);}, 2300);
    }
    else{
      retractSibling(siblingCB);
      setTimeout(function(){grow(growCB);}, 1150);
    }
  }

  function grow(details){
    branchOutAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
  }

  function retractSibling(details) {
    retractAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
    
    //Remove 'active' class after retract animation happens.
    $('#n'+details[0]).removeClass('active');
  }
        
  function parseId(id){
    var treeCoordinate = id.substring(1,3); //gets exact coordinate of the node: eg. 2c
    var treeLevel = id.substring(1,2); //gets only the level or row of the node in the tree: eg. 2
    return [treeCoordinate,treeLevel];
  }
  //Branching Out animation occurs over 1150 ms
  function branchOutAnimation (linker, wrapper, vline){
    //Check if wrapper is already active or not, and adjust margin if latter.
    if ($(wrapper).hasClass('active') === false) {
      var treeCol = linker.substring(3,4);
      var wrapperPosition = margins[treeCol];
      $(wrapper).css({"margin-left":wrapperPosition});
    }

    $(linker).addClass('active');
    $(wrapper).addClass('active');
    $(vline).addClass('active');

    $(linker).animate({height:"100%"}, 350);
    setTimeout(function(){$(wrapper).animate({"margin-left": "0", "width": "100%"}, 500);}, 350);
    setTimeout(function(){$(vline).animate({height:"100%"}, 300);}, 850);
  }
  
  //Retracting animation occurs over 1150 ms
  function retractAnimation(linker, wrapper, vline){
    $(linker).removeClass('active');
    $(wrapper).removeClass('active');
    $(vline).removeClass('active');

    var treeCol = linker.substring(3,4);
    var wrapperPosition = margins[treeCol];

    $(vline).animate({height:"0%"}, 350);
    setTimeout(function(){$(wrapper).animate({"margin-left":wrapperPosition, "width": "0"}, 500);}, 350);
    setTimeout(function(){$(linker).animate({height:"0"}, 300);}, 850);
  }
});

//Off sync happens when clicking too clickly. Need to deactive click function until all animation completes.
//Could add callback to grow function.

//Level 2 nodes currently delay the animation play. Look into why.