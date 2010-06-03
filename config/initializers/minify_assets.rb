#unless File.basename($0) == "rake"
#  puts "== Running css/js minifier =="
#  puts("cd #{RAILS_ROOT.inspect} && rake minify:css RAILS_ENV=#{ENV['RAILS_ENV']} && rake minify:js RAILS_ENV=#{ENV['RAILS_ENV']}")
#  system("cd #{RAILS_ROOT.inspect} && rake minify:css RAILS_ENV=#{ENV['RAILS_ENV'].inspect} && rake minify:js RAILS_ENV=#{ENV['RAILS_ENV'].inspect}")
#  puts "== Running css/js minifier =="
#end