var WindowManager = Class.create({
  initialize: function(options) {
    this.clientWindows = new Array;
    
    WindowManager.objects[WindowManager.objects.length] = this;
    this.id = WindowManager.objects.length;
    if(!options)
      options = {};
      
    this.setWindowProperties(options.windowProperties);
  },
  
  setWindowProperties: function(properties) {
    this.windowProperties = {
      toolbar: 'no',
      menubar: 'no',
      location: 'no',
      scrollbar: 'yes',
      resizable: 'yes',
      status: 'no',
      width: '350',
      height: '500'
    };
    
    if(properties)
      for(property in properties) {
        this.windowProperties[property] = properties[property];
      }
  },
  
  windowPropertiesToParams: function() {
    var paramString = "";
    var sp = "";
    for(property in this.windowProperties) {
      paramString += sp + property + "=" + this.windowProperties[property];
      sp = ",";
    }
    
    return paramString;
  },
  
  openWindowByUrl: function(url) {
    var w = window.open(url, 'manager-' + this.Id + '-window-' + this.clientWindows.length, this.windowPropertiesToParams());
    this.clientWindows[this.clientWindows.length] = w;
  },
  
  findWindowByConferenceId: function(conferenceId) {
    for(var i=0; i < this.clientWindows.length; i++) {
      var clientWindow = this.clientWindows[i];
      if(!clientWindow.closed && clientWindow.conference.id == conferenceId)
        return clientWindow;
    }
    
    return false;
  },
  
  openWindowByConferenceId: function(url, conferenceId) {
    var clientWindow = this.findWindowByConferenceId(conferenceId);
    
    if(clientWindow) {
      clientWindow.focus();
      clientWindow.conference.setFocus();
    }
    else {
      this.openWindowByUrl(url);
    }
  },
  
  openWindowByUserIds: function(url, userIds) {
    var clientWindow = this.findWindowByUserIds(userIds, true);
    
    if(clientWindow && !clientWindow.closed) {
      clientWindow.focus();
      clientWindow.conference.setFocus();
    }
    else {
      this.openWindowByUrl(url);
    }
  },
  
  findWindowByUserIds: function(userIds, matchLength) {
    for(var i=0; i < this.clientWindows.length; i++) {
      var clientWindow = this.clientWindows[i];
      if(clientWindow.conference) {
        if((matchLength && clientWindow.conference.users.length != userIds.length) || (clientWindow.conference.users.length < userIds.length))
          continue;
          
        allMatched = true;
        for(var j=0; j < userIds.length; j++) {
          if(!clientWindow.conference.getUserById(userIds[j]))
          {
            allMatched = false;
            break;
          }
        }
        if(allMatched)
          return clientWindow;
      }
    }
    
    return false;
  }
});

WindowManager.objects = new Array;