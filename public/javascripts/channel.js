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
      var clientWindow = windowManager.findWindowByConferenceId(conferenceId);
      if(clientWindow && !clientWindow.closed) {
        clientWindow.conference.update(json.conferenceUpdates[conferenceId]);
      }
      else {
        if(json.conferenceUpdates[conferenceId].messages.length > 0)
          this.channel.notifyConference(conferenceId, json.conferenceUpdates[conferenceId].messages);
      }
    }
    
    try{
      this.channel.contacts.updateList(json.contactUpdates);
    }catch(e){}
    
    contactRequestManager.notifyRequest(json.contactRequests);
  }
});

var Contacts = Class.create({
  initialize: function(options) {
    this.list = options.contacts || new Array;
    this.contactsContainer = options.contactsContainer;
    this.channel = options.channel;
  },
  
  updateList: function(contactsList) {
    this.contactsContainer.innerHTML = "";
    
    for(var i=0; i<contactsList.length; i++) {
      var contactDetails = contactsList[i];
      var contact = this.findById(contactDetails.id);
      if(contact)
        contact.update(contactDetails);
      else {
        contact = new User(contactDetails);
        this.list[this.list.length] = contact;
      }
      
      this.contactsContainer.insert({ bottom:contact.contactHtml() });
      contact.contactDomElement().observe('click', this.click.bindAsEventListener(this, i));
    }
  },
  
  click: function(event, i) {
    contact = this.list[i];
    windowManager.openWindowByUserIds(this.channel.conferenceUrl + "new?user_id=" + contact.id, [contact.id, this.channel.user.id]);
  },
  
  findById: function(id) {
    for(var i = 0; i < this.list.length; i++) {
      if(this.list[i].id == id)
        return this.list[i];
    }
    
    return false;
  }
});

var Channel = Class.create({
  initialize: function(options) {
    options.channel = this;
    
    this.id = options.id;
    this.channelUrl = options.channelUrl;
    this.conferenceUrl = options.conferenceUrl;
    if(this.conferenceUrl[this.conferenceUrl.length - 1] != "/")
      this.conferenceUrl += "/";
    
    this.clientWindows = new Hash;
    this.conferenceNotifiers = new Hash;
    options.contactsContainer = document.getElementById(options.contactsContainer);
    this.contacts = new Contacts(options);
    this.user = options.user;
    this.notifiersContainer = document.getElementById(options.notifiersContainer);
    this.bookmarksContainer = document.getElementById(options.bookmarksContainer);
    this.communicationInterval = options.communicationInterval || 5000;
    this.communicationTimeout = null;
    
    this.setUp();
    
    Channel.objects[Channel.objects.length] = this;
  },
  
  setUp: function() {
    this.instructionsManager = new InstructionsManager({ channel:this });
    this.responseManager = new ResponseManager({ channel:this });
    
    this.communicate();
    //this.communicationTimeout = window.setTimeout(this.communicate.bind(this), this.communicationInterval);
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
    windowManager.openWindowByConferenceId(this.conferenceUrl + conferenceId, conferenceId);
  },
  
  setChannel: function(conferenceId) {
    var clientWindow = this.clientWindows.get(conferenceId);
    if(clientWindow && !clientWindow.closed) {
      clientWindow.conference.channel = this;
    }
  },
  
  notifyConference: function(conferenceId, messages) {
    var conferenceNotifier = this.conferenceNotifiers.get(conferenceId);
    options = {
          conferenceId: conferenceId,
          messages: messages,
          container: this.notifiersContainer,
          channel: this
        };
        
    if(conferenceNotifier) {
      conferenceNotifier.update(options)
    }
    else {
      conferenceNotifier = new ConferenceNotifier(options);
      this.conferenceNotifiers.set(conferenceId, conferenceNotifier);
    }
    conferenceNotifier.show();
  },
  
  sendInstruction: function(instruction, immediate) {
    this.instructionsManager.send(instruction, immediate);
  }
})

Channel.objects = new Array;

Channel.findById = function(id) {
  for(var i = 0; i < Channel.objects.length; i++) {
    if(Channel.objects[i].id == id)
      return Channel.objects[i];
  }
  
  return false;
}