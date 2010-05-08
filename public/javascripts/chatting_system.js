var User = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.name = options.name;
    this.onlineStatus = options.onlineStatus;
    
    User.objects[User.objects.length] = this;
  },
  
  update: function(options) {
    this.name = options.name;
    this.onlineStatus = options.onlineStatus;
  }
})


User.objects = new Array;

User.findById = function(id) {
  for(var i = 0; i < User.objects.length; i++) {
    if(User.objects[i].id == id)
      return User.objects[i];
  }
  
  return false;
}