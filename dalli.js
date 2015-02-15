$(document).ready(function(){
  //Intial page rendering instructions
  $('.vline').height(0);
  
  
  
  //General click function for nodes
  $('.node').click(function(){
    $(this).addClass('active');
    //Check for active tree branches, and play retracting animation before forming a new branch.
    console.log('I am this: ' + this);
    checkSiblings(this);
    //Parse id of new branch in preparation for animation
    var nodeId = this.id;
    var details = parseId(nodeId);
    branchOutAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
  });
  
  //Checking for active sibling branch
  function checkSiblings(clickedNode){
    var hasActiveSibling = $(clickedNode).parent().siblings().children().hasClass('active');
    console.log(hasActiveSibling);
    if(hasActiveSibling){
      var activeSiblingId = $(clickedNode).parent().siblings().children('.active').attr('id');
      console.log(activeSiblingId);
      checkChildren(activeSiblingId);
      var details = parseId(activeSiblingId);
      retractAnimation("#l"+details[0],"#w"+details[1],".v"+details[1]);
      //Remove 'active' class once retract animation happens.
      $('#'+activeSiblingId).removeClass('active');
    }
  }
  //Check if an active node has active child
  function checkChildren(id){
    var details = parseId(id);
    details[1] = parseInt(details[1])+1; //adding 1 to treeX targets children nodes.
    details[0] = details[1]+ 'a'; //updating coordinate at details[0] to reflect the new level. Default column target set to 'a'.
    var targetChild = "#n"+ details[0];
    console.log("target child candidate: " + targetChild);
    var hasActiveChild = $(targetChild).parent().parent().children().children().hasClass('active');
    
    //Recursive control flow to retract children branches before parent branches.
    //Need to add appropriate lags so that parent only starts animating once child animation is complete.
    if(hasActiveChild){
      var activeChildId = $(targetChild).parent().parent().children().children('.active').attr('id');
      var childDetails = parseId(activeChildId)
      retractAnimation("#l"+childDetails[0],"#w"+childDetails[1],".v"+childDetails[1]);
      $(activeChildId).removeClass('active');
    }
    else{
      return;
    }
  }
  
  function parseId(id){
    var treeCoordinate = id.substring(1,3); //gets exact coordinate of the node: eg. 2c
    var treeX = id.substring(1,2); //gets only the level or row of the node in the tree: eg. 2
    return [treeCoordinate,treeX];
  }
  //Branching Out animation
  function branchOutAnimation (linker, wrapper, vline){
    $(linker).animate({height:"100%"}, 350);
    setTimeout(function(){$(wrapper).animate({"margin-left": "0", "width": "100%"}, 500);}, 350);
    setTimeout(function(){$(vline).animate({height:"100%"}, 300);}, 850);
    $(linker).addClass('active');
    $(wrapper).addClass('active');
    $(vline).addClass('active');
  }
  
  //Retracting animation
  function retractAnimation(linker, wrapper, vline){
    $(vline).animate({height:"0%"}, 350);
    setTimeout(function(){$(wrapper).animate({"margin-left": "37%", "width": "0"}, 500);}, 350);
    setTimeout(function(){$(linker).animate({height:"0"}, 300);}, 850);
    $(linker).removeClass('active');
    $(wrapper).removeClass('active');
    $(vline).removeClass('active');
  }
});
