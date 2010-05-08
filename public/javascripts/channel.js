var InstructionsManager = Class.create({
  initialize: function(options) {
    this.channel = options.channel;
    this.instructions = new Array;
  },
  
  send: function(instruction, immediate) {
    this.instructions[this.instructions.length] = instruction;
    
    if(immediate)
      this.channel.communicate();
  },
  
  clearInstructions: function() {
    this.instructions = new Array;
  },
  
  popInstructions: function() {
    var params = {}
    
    for(var i=0; i < this.instructions.length; i++) {
      var instruction_segments = this.instructions[i];
      params['instructions[' + i + '][command]'] = instruction_segments[0];
      
      for(var j=1; j < instruction_segments.length; j++) {
        var param = instruction_segments[j];
        params['instructions[' + i + '][params][' + (j-1) + ']'] = param;
      }
    }
    
    this.clearInstructions();
    
    return params;
  }
})

var ResponseManager = Class.create({
  initialize: function(options) {
    this.channel = options.channel;
  },
  
  responseParser: function(response) {
    var json = response.responseJSON;
    
    for(conferenceId in json.conferenceUpdates) {
      conference = this.channel.getConferenceById(conferenceId);
      if(conference) {
        conference.update(json.conferenceUpdates[conferenceId]);
      }
      else {
        if(json.conferenceUpdates[conferenceId].messages.length > 0)
          this.channel.notifyConference(conferenceId, json.conferenceUpdates[conferenceId].messages);
      }
    }
  }
})

var Channel = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.channelUrl = options.channelUrl;
    this.conferenceUrl = options.conferenceUrl;
    if(this.conferenceUrl[this.conferenceUrl.length - 1] != "/")
      this.conferenceUrl += "/";
    
    this.clientWindows = new Hash;
    this.conferenceNotifiers = new Hash;
    this.user = options.user;
    this.notifiersContainer = options.notifiersContainer;
    this.communicationInterval = options.communicationInterval || 5000;
    this.communicationTimeout = null;
    
    this.setUp();
  },
  
  setUp: function() {
    this.instructionsManager = new InstructionsManager({ channel:this });
    this.responseManager = new ResponseManager({ channel:this });
    
    this.communicationTimeout = window.setTimeout(this.communicate.bind(this), this.communicationInterval);
  },
  
  communicate: function() {
    window.clearTimeout(this.communicationTimeout);
    sendRequest(this.channelUrl, this.instructionsManager.popInstructions(), this.responseManager.responseParser.bind(this.responseManager));
    
    this.communicationTimeout = window.setTimeout(this.communicate.bind(this), this.communicationInterval);
  },
  
  getConferenceById: function(conferenceId) {
    for(var i=0; i < this.clientWindows.length; i++) {
      try {
      if(this.clientWindows[i].conference.id == conferenceId)
        return this.clientWindows[i].conference;
      } catch(e) { }
    }
  },
  
  newClientWindow: function(conferenceId) {
    var clientWindow = this.clientWindows.get(conferenceId);
    if(!clientWindow || clientWindow.closed) {
      clientWindow = window.open(this.conferenceUrl + conferenceId, 'conference-window-' + this.conferenceId, 'status=1,location=1,width=350,height=500');
      this.clientWindows.set(conferenceId, clientWindow);
    }
    else {
      clientWindow.focus();
      clientWindow.conference.setFocus();
    }
  },
  
  notifyConference: function(conferenceId, messages) {
    try{
    var conferenceNotifier = this.conferenceNotifiers.get(conferenceId);
    }catch(e){alert(e);}
    if(conferenceNotifier) {
      conferenceNotifier.update({
          conferenceUrl: this.conferenceUrl + conferenceId,
          conferenceId: this.conferenceId,
          messages: messages,
          container: this.notifiersContainer,
          channel: this
        })
    }
    else {
      conferenceNotifier = new ConferenceNotifier({
          conferenceUrl: this.conferenceUrl + conferenceId,
          conferenceId: this.conferenceId,
          messages: messages,
          container: this.notifiersContainer,
          channel: this
        });
      this.conferenceNotifiers.set(conferenceId, conferenceNotifier);
    }
    conferenceNotifier.show();
  }
})