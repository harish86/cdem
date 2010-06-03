// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function checkAllBoxes(options) {
  var selectBoxes = document.getElementsByClassName(options.selectBox);
  var checkAll = document.getElementById(options.checkAll);
  
  for(var i=0; i<selectBoxes.length; i++) {
    selectBoxes[i].checked = checkAll.checked;
  }
}

function updateCheckAll(options) {
  var selectBoxes = document.getElementsByClassName(options.selectBox);
  var checkAll = document.getElementById(options.checkAll);
  
  for(var i=0; i<selectBoxes.length; i++) {
    if(selectBoxes[i].checked == false) {
      checkAll.checked = false;
      return;
    }
  }
  checkAll.checked = true;
}

function selectedAll(options) {
  var selectBoxes = document.getElementsByClassName(options.selectBox);
  
  for(var i=0; i<selectBoxes.length; i++) {
    if(selectBoxes[i].checked == false) {
      return false;
    }
  }
  
  return true;
}

function selectedAny(options) {
  var selectBoxes = document.getElementsByClassName(options.selectBox);
  
  for(var i=0; i<selectBoxes.length; i++) {
    if(selectBoxes[i].checked == true) {
      return true;
    }
  }
  
  return false;
}

function showIfSelectedAny(options) {
  if(selectedAny(options))
    showElement(options.displayElement);
  else
    hideElement(options.displayElement);
}

function enableIfSelectedAny(options) {
  var enableElements = document.getElementsByClassName(options.enableElements);
  
  for(var i=0; i<enableElements.length; i++) {
    if(selectedAny(options))
      enableElements[i].removeAttribute('disabled');
    else
      enableElements[i].setAttribute('disabled', 'disabled');
  }
}