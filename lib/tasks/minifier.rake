namespace :minify do
  desc 'Minify js'
  task :js => :environment do
    ActionView::Base.new(Rails::Configuration.new.view_path).render :partial=>"shared/javascript_includes"
    source_files = Dir.glob(File.join(RAILS_ROOT, "public", "javascripts", "cache", "*"))
    
    source_files.each do |source_file|
      if File.file?(source_file)
        output = system("java -jar #{File.join(RAILS_ROOT, 'script', 'yui-compressor.jar')} --type js -o #{source_file} #{source_file}")
        puts "System call failed to minify js file: #{source_file}" unless output
      end
    end
  end
  
  desc 'Minify css'
  task :css => :environment do
    ActionView::Base.new(Rails::Configuration.new.view_path).render :partial=>"shared/stylesheet_includes"
    source_files = Dir.glob(File.join(RAILS_ROOT, "public", "stylesheets", "cache", "*"))
    
    source_files.each do |source_file|
      if File.file?(source_file)
        output = system("java -jar #{File.join(RAILS_ROOT, 'script', 'yui-compressor.jar')} --type css -o #{source_file} #{source_file}")
        puts "System call failed to minify css file: #{source_file}" unless output
      end
    end
  end
end