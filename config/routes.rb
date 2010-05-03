ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  
  map.user_search "/users/search", :controller=>"users", :action=>"search"
  map.logout "/login", :controller=>"account", :action=>"login"
  map.logout "/logout", :controller=>"account", :action=>"logout"
  map.logout "/signup", :controller=>"account", :action=>"signup"
  map.reset_password "/reset_password", :controller=>"account", :action=>"reset_password" 
  
  map.resources :users, :collection => {:add_to_contacts => :any}, :member => {:contact_list => :any}
  
  map.resources :conferences do |conference|
    conference.resources :messages
  end
  map.unauthorized "/unauthorized", :controller=>"main", :action=>"unauthorized"

  # See how all your routes lay out with "rake routes"
  map.root :controller => "main", :action=>"index"

  # Install the default routes as the lowest priority.
#  map.connect ':controller/:action/:id'
#  map.connect ':controller/:action/:id.:format'
end
