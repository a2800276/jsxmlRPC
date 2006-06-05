#!/usr/bin/env ruby


begin
	require "xmlrpc/server"
	s = XMLRPC::CGIServer.new

	s.add_handler("helloWorld") do 
		"hello, world"
	end
	
	s.add_handler("hello.World") do
		"hello, world"
	end
	s.add_introspection
	s.serve

rescue Exception => e
	print "Content-type: text/plain\r\n\r\n"
	print "#{e}\n"
	print "#{e.backTrace}\n"
	print "End Exception Handling\n"	
end


