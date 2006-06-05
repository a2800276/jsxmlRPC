#!/usr/bin/env ruby

require "ftools"


`./prepare.rb`

distRoot = "jxmlsRPC"
File.makedirs("dist/#{distRoot}/src")
File.makedirs("dist/#{distRoot}/test")
File.makedirs("dist/#{distRoot}/test/data")
File.makedirs("dist/#{distRoot}/test/css")
File.makedirs("dist/#{distRoot}/test/ws")
File.makedirs("dist/#{distRoot}/testdist")

# copy src/*js -> dist
Dir["src/*.js"].each {|fname|
	File.copy(fname, "dist/#{distRoot}/src", true)
	
}

Dir["test/*"].each { |fname|
	File.copy(fname, "dist/#{distRoot}/test", true) unless FileTest.directory?(fname)
}

Dir["test/*/*"].each {|fname|
	File.copy(fname, "dist/#{distRoot}/"+fname, true)
	#puts fname	
}


File.copy("prepare.rb", "dist/#{distRoot}", true)
File.copy("prepare_dist.rb", "dist/#{distRoot}", true)
File.copy("prepare_tests.rb", "dist/#{distRoot}", true)
File.copy("README", "dist/#{distRoot}", true)
File.copy("CHANGES", "dist/#{distRoot}", true)

File.copy("dist/all_scripts.js", "dist/#{distRoot}", true)

## only gnu tar !
`tar -czf jsxmlRPC.tgz -C dist/ #{distRoot}`


