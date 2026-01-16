# Flow Folder

Flow Forms endpoints!

### Screen

```
"screen" : {
  "id": string,
  "terminal": ?boolean,
  "success": ?boolean,
  "title": ?string,
  "refresh_on_back": ?boolean,
  "data": ?object,
  "layout": object
}
```

The *data* object could be further expanded to\
this example below

```
{
  "data": {
    "first_name": {
      "type": "string",
      "__example__": "John"
    }
  }
}
```