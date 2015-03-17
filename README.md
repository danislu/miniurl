# miniurl

miniurl is a REST based tinyurl-ish clone.

POST /
```javascript
{
 "id": "wtf,
 "url": "www.google.com",
 "timeout": 10
}
```
RESULT:
200 OK
or
505
```javascript
{
	"message": "wtf in use"
}
```

GET /
RESULT:
```javascript
[
	{
		"id": "one",
		"url": "www.google.com",
		"fetch_count": 1
	},
	{
		"id": "two",
		"url": "www.google.com",
		"fetch_count": 19
	}
]
```

GET /<id>
RESULT:
302  http://example.com/the/path/added/for/this/key/before
or
404

DELETE /<id>
RESULT:
204
or
404


