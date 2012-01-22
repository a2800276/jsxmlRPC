#!/usr/bin/env ruby

files = [
  "src/request_basics.js",
  "src/type_basics.js",
  "src/xml_basics.js",
  "src/xml_rpc_request_basics.js",
  "src/xml_rpc_response_basics.js",
  "src/xmlrpc.js"
]

class CommentParser
  def initialize infile, outfile
    @infile = infile
    @outfile = outfile
    @lineComment = false
    @blockComment = false
    @quote = false
  end

  def parse
    while c = @infile.getc
      if isSpace c
        @outfile.putc 32
        handleSpace
      elsif c==47 # /
        oldPos = @infile.pos
        arr = [@infile.getc, @infile.getc, @infile.getc, @infile.getc, @infile.getc, @infile.getc]
        str = ""
        arr.collect { |char|
          str << char
        }
        break if str == "*TESTS" # /*TESTS is marker to stop including in all_scripts
        @infile.pos=oldPos
        handleComment
      elsif c==34 || c==39   # " '
        @outfile.putc c
        handleQuotes c
      else
        @outfile.putc c
      end
    end
  end

  def isSpace fixnum
    return fixnum == 32 || fixnum==9
  end

  def handleQuotes endQuot
    # 92 == \
    c = @infile.getc
    if (c==92)
      @outfile.putc c
      @outfile.putc @infile.getc
    elsif (c==endQuot)
      @outfile.putc c
      return
    else
      @outfile.putc c
    end
    handleQuotes endQuot
  end

  def handleSpace
    while isSpace(@infile.getc)
    end
    @infile.pos= @infile.pos-1
  end
  
  def handleComment
    c = @infile.getc
    if (c==47)   # c++ style comment 47=/
      handleCPlus
    elsif (c==42) # block comment 42=*
      handleBlockComment
    else # not a comment
      @outfile.putc 47  
      @infile.pos = @infile.pos-1
    end
  end

  def handleBlockComment
    c = @infile.getc
    #puts c 
    if (c == 42) # *
      return if (@infile.getc == 47) # /
      @infile.pos = @infile.pos-1
    end
    handleBlockComment
  end

  def handleCPlus
    c = @infile.getc
    unless (c==13 || c==10) # \r \n
      handleCPlus
    else
      # maybe one more
      c = @infile.getc
      @infile.pos=@infile.pos-1 unless (c==13 || c==10)

    end
  end
  
end

require "ftools"
File.makedirs("dist/")

File.open("dist/all_scripts.js", "w") { |outfile|
  outfile.puts "/* 
  Copyright (c) 2006, 2012, Tim Becker (tim@kuriositaet.de)
  All rights reserved.
  Full license details at www.kurisositaet.de/jsxmlrpc/LICENSE.txt
  In short: feel free to do what you want with this, but give me some 
  credit and don't sue me. (BSD License)
*/
  "

  files.each { |f|
  puts f
    File.open(f, "r") { |infile|
      cp = CommentParser.new(infile, outfile)
      cp.parse
    }
  }
}


