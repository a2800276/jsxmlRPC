#!/usr/bin/env ruby

require "ftools"


`ruby ./prepare.rb`

distRoot = "jsxmlRPC"

`rm -rf dist/jsxmlRPC`

File.makedirs("dist/#{distRoot}/src")
File.makedirs("dist/#{distRoot}/site")
File.makedirs("dist/#{distRoot}/tests")
File.makedirs("dist/#{distRoot}/tests/ws")
File.makedirs("dist/#{distRoot}/tests/data")

# copy src/*js -> dist
Dir["src/*.js"].each {|fname|
  File.copy(fname, "dist/#{distRoot}/src", true)
  
}

Dir["site/*.markdown"].each {|fname|
  File.copy(fname, "dist/#{distRoot}/site", true)
}

Dir["tests/*/*"].each {|fname|
  File.copy(fname, "dist/#{distRoot}/"+fname, true)
  #puts fname  
}


File.copy("prepare.rb", "dist/#{distRoot}", true)
File.copy("prepare_dist.rb", "dist/#{distRoot}", true)
File.copy("prepare_tests.rb", "dist/#{distRoot}", true)
File.copy("README.md", "dist/#{distRoot}", true)
File.copy("CHANGES", "dist/#{distRoot}", true)

File.copy("dist/all_scripts.js", "dist/#{distRoot}", true)

## only gnu tar !
timestr = Time.new.strftime "%Y%m%d"
`tar -czf jsxmlRPC_#{timestr}.tgz -C dist/ #{distRoot}`


