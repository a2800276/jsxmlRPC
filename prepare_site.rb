#!/usr/bin/env ruby


# quick utility script to assemble all the files necessary for
# the jsxmlrpc site and upload them...

require "ftools"
require "bluecloth"

`ruby ./prepare_dist.rb`

output_dir = "site_output"

# guess at the filenames to generate a halfassed html TITLE.
def get_title file_name

	file_name =~ /([^.]*).html/
	file_name = $1.gsub /_/, " "
	

	file_name =  "Introduction" if file_name =~ /jsxmlrpc/

	title = "jsxmlRPC :: "
	title += file_name.split.map{|w| w.capitalize}.join(" ")
end




File.makedirs(output_dir)
File.copy("README", "site/download.markdown", true)
File.copy("dist/all_scripts.js", output_dir)

# retrieve the template file...

template = IO.readlines("site/site.template").join

Dir["site/*.markdown"].each do |file_name|
	file_name =~ /site\/([^.]*).markdown/
#	outFile = fileName.gsub(/\.markdown/, ".html")
	outFile = $1+".html"

	File.open("#{output_dir}/#{outFile}", "w") { |out|
		bc = BlueCloth::new(File.readlines(file_name).join)
		out.puts(template % [get_title(outFile), bc.to_html])	
	}
	
end

puts "About to transfer file to : #{ARGV[0]}"
require 'net/ftp'
Net::FTP.open(ARGV[0], ARGV[1], ARGV[2]) do |ftp|
	ftp.chdir('webseiten/javascript')
	Dir["#{output_dir}/*"].each {|file|
		puts "Transferring: #{file}"
		ftp.puttextfile file
	}
	
end


exit


`ruby ./prepare_dist.rb`


File.makedirs("dist/#{distRoot}/src")


# copy src/*js -> dist
Dir["src/*.js"].each {|fname|
	File.copy(fname, "dist/#{distRoot}/src", true)
	
}

