# _jsxmlRPC_ ::  Download

You have several options for obtaining the _jsxmlRPC_ distribution:

* Download the [tarball][sourceforge] from the Sourceforge download page.
* Retrieve the [latest][svn] from the Sourceforge Subversion repository.
* Retrieve [this][script] file, which contains a single file which you need to
  include in order to use _jsxmlRPC_.

I've not really had time to make the distribution pretty. The following
files are included in the distribution:

* `README` this file

* `all_scripts.js` probably what you are looking for. The Javascript
  to include to use the library. 

* `src` this directory contains all the commented javascript source
  files and rudimentary unit tests for the distribution. These files get
  processed into one large file that's stripped of comments and
  unnecessary whitespace


* `prepare.rb` the script to assemble the source files.

* `prepare_dist.rb` the script to prepare the jsRPC distribution
  tarball.

* `prepare_site.rb` scripts to set up the website. (You probably won't be needing this.)

* `dist` this is the directory that the source files are assembled into.
  it contains the file `all_scripts.js` generated by `prepare.rb`. In
  case you are repackaging the main distribution tarball, that also gets
  assembled in this directory.

* `prepare_tests.rb` prepares the unit tests from the source files.
  Since the tests also include calls to webservices (which are included)
  they currently need to be install on a server that support ruby for CGI.
  Most likely, you'll not have sufficient infrastructure, the tests are
  hosted [here][1].

* `tests` some of the required infrastructure that `prepare_tests.rb`
  uses to construct the distribution. This is a really crude attempt at
  a Javascript unit test runner. The tests are implemented as an array of
  functions at the bottom of each "raw" javascript file in the `src`
  directory. The testrunner calls each function in the array. The test
  functions in the array return either `true` or `false` to determine
  whether that test passed. Some test have an `undefined` result.
  
  The `prepare.rb` script removes these tests when preparing the
  `all_scripts.js` distribution file.



[1]: http://www.kuriositaet.de/javascript/test_ng/index.html
[sourceforge]: http://sourceforge.net/project/showfiles.php?group_id=168212
[svn]: http://sourceforge.net/svn/?group_id=168212
[script]: all_scripts.js

