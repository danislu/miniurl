# miniurl

miniurl is a REST based tinyurl-ish clone.

## Adding 

To add one do a *POST* to the root with body;
```javascript
{
 "id": "wtf,  // id you want to use when getting redirected
 "url": "www.google.com", // url you want to get redirected to
 "timeout": 10 // optional. Seconds you want the redirect to be valid for. Will automagically be removed after this has exired.
}
```


The result will be '200 OK' if all is well, or '409 Conflict' with body;
```javascript
{
	"message": "wtf in use"
}
```

## Getting all the stuff

To get of all the urls registered do a *GET* request to the root. The result will be '200 OK' with a JSON array.
Somehting like this;
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

## Removing some stuff

To remove an entry do a *DELETE* request to the id of the item you want to remove.
E.g. ```DELETE /<id>```
The result will be either '204 No Content' indicating that the resource was successfully deleted or '404 Not Found' indicating that the resource was not found.

## Getting redirected

Do a *GET* request to the id for the url you want to be redirected to. 
E.g. ```GET /<id>```
The result will be a '302 Found' redirecting the request to the url registerd to the given id, or a '404 Not Found' if the resource was not found.
