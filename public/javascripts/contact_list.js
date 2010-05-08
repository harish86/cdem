var Contact = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.name = options.name;
    this.email = options.email;
    this.onlineStatus = options.onlineStatus;
    this.conferenceUrl = options.conferenceUrl;
    this.htmlString = options.htmlString;
    this.conferenceWindow = null;
  },
  
  update: function(options) {
    this.name = options.name;
    this.email = options.email;
    this.onlineStatus = options.onlineStatus;
    this.htmlString = options.htmlString;
  },
  
  isOnline: function() {
    return(this.onlineStatus == 'Online');
  },
  
  onlineStatusIndicator: function() {
    html = "";
    
    if(this.isOnline()) {
      html += "+";
    }
    else {
      html += "-";
    }
    
    return html;
  },
  
  htmlId: function() {
    return "contact-" + this.id;
  },
  
  htmlClassName: function() {
    return "contact contact-" + this.onlineStatus;
  },
  
  htmlHoverClassName: function() {
    return " contact contact-hover contact-" + this.onlineStatus;
  },
  
  toHtml: function() {
    var html = "<div id='" + this.htmlId() + "' class='" + this.htmlClassName() + "'>";
    html += this.htmlString;
    html += "</div>"
    
    return html;
  },
  
  updateHtml: function() {
    this.getHtmlElement().innerHTML = this.htmlString;
    this.getHtmlElement().className = this.htmlClassName();
  },
  
  getHtmlElement: function() {
    return document.getElementById(this.htmlId());
  },
  
  setEvents: function() {
    var element = this.getHtmlElement();
    element.observe("click", this.onClick.bindAsEventListener(this));
    element.observe("mouseover", this.onMouseover.bindAsEventListener(this));
    element.observe("mouseout", this.onMouseout.bindAsEventListener(this));
  },
  
  onClick: function() {
    if(this.conferenceWindow && !this.conferenceWindow.closed) {
      this.conferenceWindow.focus();
      this.conferenceWindow.conference.setFocus();
    }
    else {
      this.conferenceWindow = window.open(this.conferenceUrl + '?contact_id=' + this.id, 'conference-window-' + this.id, 'status=1,location=1,width=350,height=500');
    }
  },
  
  onMouseover: function() {
    this.getHtmlElement().className = this.htmlHoverClassName();
  },
  
  onMouseout: function() {
    this.getHtmlElement().className = this.htmlClassName();
  }
})

var ContactList = Class.create({
  initialize: function(options) {
    this.container = document.getElementById(options.container);
    this.contactsFetchUrl = options.contactsFetchUrl;
    this.conferenceUrl = options.conferenceUrl;
    this.contacts = new Hash;
    
    this.fetchContacts();
    window.setInterval(this.fetchContacts.bind(this), 2500);
  },
  
  fetchContacts: function() {
    sendRequest(this.contactsFetchUrl, {}, this.parseResponse.bind(this));
  },
  
  parseResponse: function(response) {
    var json = response.responseJSON;
    
    for(var i=0; i < json.contacts.length; i++) {
      this.addContact(json.contacts[i]);
    }
    
    this.updateHtml();
  },
  
  addContact: function(contact) {
    contact.conferenceUrl = this.conferenceUrl;
    if(this.contacts.get(contact.id)) {
      this.contacts.get(contact.id).update(contact);
      //this.contacts.get(contact.id).updateHtml();
    }
    else {
      this.contacts.set(contact.id, new Contact(contact));
      //this.container.insert({ bottom:this.contacts.get(contact.id).toHtml() });
      //this.contacts.get(contact.id).setEvents();
    }
  },
  
  updateHtml: function() {
    this.container.innerHTML = "";
    
    for(var i=0; i < this.contacts.keys().length; i++) {
      var contact = this.contacts.get(this.contacts.keys()[i]);
      
      this.container.insert({ bottom:contact.toHtml() });
      contact.setEvents();
    }
  }
})