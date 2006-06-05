
# jsxmlrpc includes a rudimentary test harness, which works as follows:
# javascript files in the `src` directory may contain an array of tests
# to check their functionality. These tests must be placed at the bottom
# of the source files after a line of comments starting with `/*TESTS`
# These tests should be an array of functions that perform the
# individual tests, the functions return true if the test was
# successful.
#
# This script assembles all the test arrays into a single file named
# `tests/all_tests.js`. This file is loaded by the testrunner
# `tests/index.html` which will try to run each function contained in an
# array named `<something>_tests`


# USAGE:
# just run this script using ruby. It will generate the `all_tests.js`
# file in the `tests` directory automatically from all source files in
# the `src directory.
	

File.open("tests/all_tests.js", "w") { |output|
	Dir["src/*.js"].each {|filename|
		puts filename
		File.open(filename,"r") { |file|
			file.each {|line|
				if line =~ /\/\*TESTS/ 
					output.print line
					break
				end
			}
			file.each {|line|
				output.print line
			}

		}
	}
}

# generate the all_scripts.js file
`ruby ./prepare.rb`

require "ftools"
File.copy("dist/all_scripts.js", "tests")

