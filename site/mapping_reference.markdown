# _jsxmlRPC_ :: Reference of XML-RPC to Javascript Mappings

This Section describes how the _jsxmlRPC_ library maps Javascript objects to
XML-RPC and vice versa.

[XML-RPC][1] provides the following primitive [data types][2] :

* `int` (aka `i4`)
* `boolean`
* `string`
* `double`
* `dateTime.iso8601`
* `base64`

as well as the following composite data types:

* `struct`s
* `array`s

XML-RPC and Javascript types are automatically mapped to one another. The
mapping is implemented as follows:

##`Boolean` <-> `boolean`

## `Date` <-> `dateTime.iso8601`

## `String` <-> `string`

String, Date and Boolean data types are available in both XML-RPC and
Javascript and are converted to their respective counterpart.

### Example

<div class="code">

	<!-- in XML RPC -->
	<param>
		<value><string>hello, world</string></value>
	</param>

	// in Javascript

	"hello, world"

	// Javascript

	date = new Date (2006,01,13,15,12,00)

	<!-- translates to XML RPC -->
	
	<param>
		<value><dateTime.iso8601>20060113T15:12:00</dateTime.iso8601></value>
	</param>

</div>


## `Number` <-> `int` `i4` `double`

`int`, `i4` and `double` are converted to Javascript `Number` objects
and can thus be dealt with just like any number in Javascript.  When converting
Javascript `Number`s to XML-RPC types, the library converts values that
have fractional values to `double` and values that don't to `int`s.
This behavior may change in the future in case you need to explicitly
send float values that have no fractional part.

The library always uses the `int` tag instead of `i4` in order to encode
integer values, but can receive either variant.

### Example

<div class="code">

	<!-- in XML RPC -->
	<param>
		<value><i4>41</i4></value>
	</param>

	// translates to Javascript:

	41

	// This value in Javascript:

	41.5

	<!-- translates to XML RPC -->
	
	<param>
		<value><double>41.5</double></value>
	</param>

	

</div>


##`Base64`

With the exception of `base64`, all the basic data types are trivial to
map. Although it wouldn't be very difficult to implement `base64` data,
the library currently doesn't support this data type, mainly because I
don't see any point in returning binary data to a Javascript client.


## Composite Datatypes

### `Array`
The `Array` type is available in both realms and are converted to
their respective counterparts. Neither Javascript nor XML-RPC support
array typing, therefore arrays can hold values of arbitrary types, including
further arrays.

## Examples

<div class="code">

	<!-- in XML RPC -->
	<array>
		<data>
			<value><i4>12</i4></value>
			<value><string>Egypt</string></value>
			<value><boolean>0</boolean></value>
			<value><i4>-31</i4></value>
		</data>
	</array>

	// maps to the following array in Javascript
	arr[0]==12 // true
	arr[1]=="Egypt" // true
	arr[2]==false // true
	arr[3]==-31 //true

	// this array in Javascript
	arr = []
	for (var i=0; i!=3; ++i) {
		arr.push(i)	
	}

	<!-- translates to this XML-RPC Array -->
	<array>
		<data>
			<value><int>0</int></value>
			<value><int>1</int></value>
			<value><int>2</int></value>
		</data>
	</array>



</div>


###`Struct`
The `struct` datatype in XML-RPC is a list of `members` each having a
`name` and a `value`. Unfortunately, the XML-RPC spec is unclear about
whether the `name`s are required to be unique, i.e. only one member with
a given name in each `struct`. The _jsxmlRPC_ library requires the member
names to be unique.

`struct`s are mapped to Javascript `Object`s that have properties
named after the member names. The values of the named properties
correspond to the values of the `struct` members.

`struct`s in XML-RPC are also not typed, so values can be of arbitrary
type, including further `struct`s, arrays or primitive types. Member names
are strings.

### Example

<div class="code">
	
	<!-- in XML-RPC -->
	
	<struct>
		<member>
			<name>lowerBound</name>
			<value><i4>18</i4></value>
		</member>
		<member>
			<name>upperBound</name>
			<value><i4>139</i4></value>
		</member>
	</struct>

	// would map to the following in Javascript

	obj = ...
	obj.lowerBound==18
	obj.upperBound==139

	// the following Javascript

	obj2 = new Object()
	obj2.testValue = "test"
	obj2.testArray = [1,2,3]

	<!-- maps to the following XML-RPC-->
	<struct>
		<member>
			<name>testValue</name>
			<value><string>test</string></value>
		</member>
		<member>
			<name>testArray</name>
			<value>
				<array><data>
					<value><int>1</int></value>
					<value><int>2</int></value>
					<value><int>3</int></value>
				</data></array>
			</value>
		</member>
	</struct>

	
	
</div>









[1]: http://www.xmlrpc.com
[2]: http://www.xmlrpc.com/spec

