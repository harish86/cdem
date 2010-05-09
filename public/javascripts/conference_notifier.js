var ConferenceNotifier = Class.create({
  initialize: function(options) {
    this.messages = options.messages;
    this.channel = options.channel;
    this.conferenceId = options.conferenceId;
    this.container = options.container;
    this.hideDelay = options.hideDelay || 10000;
    
    ConferenceNotifier.objects[ConferenceNotifier.objects.length] = this;
    this.id = ConferenceNotifier.objects.length;
    
    this.hideTimeout = null;
    this.insertHtml();
    this.setEvents();
  },
  
  update: function(options) {
    this.conferenceUrl = options.conferenceUrl;
    this.messages = options.messages;
    this.channel = options.channel;
    this.conferenceId = options.conferenceId;
    this.container = options.container;
    
    this.insertHtml();
  },
  
  closeElement: function() {
    return this.getElement().getElementsByClassName('conference-notifier-close')[0];
  },
  
  headerElement: function() {
    return this.getElement().getElementsByClassName('conference-notifier-header')[0];
  },
  
  bodyElement: function() {
    return this.getElement().getElementsByClassName('conference-notifier-body')[0];
  },
  
  setEvents: function() {
    if(this.closeElement())
      this.closeElement().observe("click", this.hide.bindAsEventListener(this));
      
    if(this.bodyElement())
      this.bodyElement().observe("click", this.click.bindAsEventListener(this));
  },
  
  htmlId: function() {
    return 'conference-notifier-' + this.id;
  },
  
  getElement: function() {
    if(!this.element)
      this.element = document.getElementById(this.htmlId());
    
    return this.element;
  },
  
  innerHtml: function() {
    var htmlString = "";
    
    for(var i = 0; i < this.messages.length; i++) {
      var message = this.messages[i];
      
      htmlString += "<div id=class='conference-notifier-message-" + message.id + "' class='conference-notifier-message'>";
        htmlString += "<div class='conference-notifier-message-text'>";
          htmlString += textToHtml(message.text);
        htmlString += "</div>";
        
        if(!this.messages[i+1] || message.senderId != this.messages[i+1].senderId) {
          htmlString += "<div class='conference-notifier-message-sender'>";
            htmlString += "- " + User.findById(message.senderId).name;
          htmlString += "</div>";
        }
        
        htmlString += "<div class='conference-notifier-message-sent-at'>";
          htmlString += message.sentAt;
        htmlString += "</div>";
      htmlString += "</div>";
      
      previousSenderId = message.senderId;
    }
    
    return htmlString;
  },
  
  toHtml: function() {
    var htmlString = "";
    
    htmlString += "<div id='" + this.htmlId() + "' class='conference-notifier'>";
      htmlString += "<div class='conference-notifier-header'>";
      htmlString += "<span class='conference-notifier-close'>(X)</span>";
      htmlString += "There are unread messages from this chat. Click below to vew conversation.";
      htmlString += "</div>";
      htmlString += "<div class='conference-notifier-body'>";
      htmlString += this.innerHtml();
      htmlString += "</div>";
    htmlString += "</div>";
    
    return htmlString;
  },
  
  insertHtml: function() {
    if(this.getElement()) {
      this.bodyElement().innerHTML = this.innerHtml();
    }
    else {
      Element.insert(this.container, {bottom: this.toHtml()});
    }
  },
  
  show: function() {
    if(!this.getElement()) {
      this.insertHtml();
    }
    
    this.getElement().style.display = "block";
    //this.hideTimeout = window.setTimeout(this.hide.bind(this), this.hideDelay);
  },
  
  hide: function() {
    if(this.getElement()) {
      this.getElement().style.display = "none";
    }
    
    window.clearTimeout(this.hideTimeout);
  },
  
  click: function() {
    this.channel.newClientWindow(this.conferenceId);
    this.hide();
  }
});

ConferenceNotifier.objects = new Array;

ConferenceNotifier.findById = function(id) {
  for(var i = 0; i < ConferenceNotifier.objects.length; i++) {
    if(ConferenceNotifier.objects[i].id == id)
      return ConferenceNotifier.objects[i];
  }
  
  return false;
}