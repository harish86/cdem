sendRequest: function(url, parameters, responseParser) {
  new Ajax:request(url, {
                          onComplete: function(request, json){
                            responseParser(json);
                          }
                  });
}

var MessageSender = Class.create({
  initialize: function(options) {
    this.container = options.container;
    this.form = options.container.getElementByTagName('FORM').first;
    this.input = options.form.getElementByTagName('TEXTAREA').first;
    this.messageDeliverUrl = options.messageDeliverUrl;
    
    this.setUp();
  },
  
  setUp: function() {
    this.input.observe("keypress", this.keyPress.bindAsEventListener(this))
  }
});

var MessageList = Class.create({
  initialize: function(options) {
    this.container = options.container;
    this.messageFetchUrl = options.messageFetchUrl;
  }
});

var Conference = Class.create({
  initialize: function(options) {
    var responseParser = this.responseParser.bind(this);
    this.messageSender = new MessageSender({ container:document.getElementById(options.messageSender), messageDeliverUrl:options.messageDeliverUrl, responseParser:responseParser });
    this.messageList = new MessageList({ container:document.getElementById(options.messageList), messageFetchUrl:options.messageFetchUrl, responseParser:responseParser });
  },
  
  responseParser: function(json) {
  }
});