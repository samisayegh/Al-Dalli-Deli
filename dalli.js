$(document).ready(function(){
  //Intial page rendering instructions
  $('.vline').height(0);

  //Retract animation duration (ms).
  var animationLength = 700;

  //Tracks tree depth during recursive calls of checkChildren
  var depth = 0;

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
  
  //Terminal node click function to open photo/video pod.
  $('.terminal').click(function(){
    
  });
  
  //General click function for nodes that are not already active.
  $('.node').click(function(){
    //Deactives node click function to prevent a new animation from starting before the current one is complete.
    $('.node').not('.terminal').css("pointer-events", "none");
    
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
      setTimeout(function(){extend(extendDetails);}, animationLength*depth);
    }
    else {
      extend(extendDetails);
    }
    //Restore click function.
    setTimeout(function(){$('.node').css("pointer-events", "auto");},1000+(animationLength*depth));
    depth = 0;
  }
  
  //Check if an active node has active child
  function checkChildren(activeParentId, parentDetails, extendDetails){
    //Sets target child
    var targetDetails = parseId(activeParentId);
    targetDetails[1] = parseInt(targetDetails[1])+1; //adding 1 to treeLevel targets children nodes.
    targetDetails[0] = targetDetails[1]+ 'a'; //updating coordinate at targetDetails[0] to reflect the new level. Default column target set to 'a'.
    var targetChild = "#n"+ targetDetails[0];
    var hasActiveChild = $(targetChild).parent().parent().children().children().hasClass('active');
    
    //Recursive flow to retract children branches before parent branches.
    if(hasActiveChild){
      var activeChildId = $(targetChild).parent().parent().children().children('.active').attr('id');
      var childDetails = parseId(activeChildId);
      var isTerminal = $('#'+activeChildId).hasClass('terminal');

      //Terminal nodes have no children.
      if(isTerminal){
        $("#"+activeChildId).removeClass('active');
        retract(parentDetails);
        ++depth;
        return;
      }
      //If active and not terminal, check children of the new node.
      else{
        checkChildren(activeChildId, childDetails, extendDetails);
        setTimeout(function(){retract(parentDetails);}, animationLength*depth);
        ++depth;
        return;
      }
    }
    //If no active children.
    else{
      retract(parentDetails);
      ++depth;
      return;
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
