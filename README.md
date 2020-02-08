## Machine interface

http://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080/ui/

When a user starts using the machine, the machine should send
```
{
  "event": "start",
  data: {
    "id": string // machine id
  }
}
```

When a user finishes using the machine, the machine should send
```
{
  "event": "end",
  data: {
    "id": string // machine id
  }
}
```

## Web app

http://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080/web/

## Server

Websocket server URL is `ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080`.

Messages are transmitted in JSON. The base format is
```
{ "event": string, "data": any }
```

After connecting to the server, it will immediately emit the following message
```
{
    "event": "info",
    "data": {
        "machineCount": integer
    }
}
```
and then the server will emit this message for every machine:
```
{
  "event": "addMachine",
  "data": {
    "id": string,
    "address": string,
    "lat": float,
    "lng": float,
    "online": boolean,
    "products": [{
      "id": string,
      "type": "dishwashing" | "soap" | "shampoo",
      "name": string,
      "price": float, // price per liter
      "capacity": float, // container capacity in liters
      "available": float, // how much product is still available in liters
      "dispensing": boolean // is this product currently being dispensed
    }]
  }
}
```

When the machine is turned on or off, it sends the following message and the server broadcasts it:
```
{
    "event": "updateMachine",
    "data": {
        "id": string,
        "online": boolean
    }
}
```

When the machine starts dispensing a liquid, the machine sends this message and the server broadcasts it:
```
{
  "event": "updateProduct",
  "data": {
    "id": string, // product id
    "dispensing": true
  }
}
```

While dispensing a liquid, the machine periodically updates the product availability by sending this message and the server broadcasts it:
```
{
  "event": "updateProduct",
  "data": {
    "id": string, // product id
    "available": float // how much product in liters is now available
  }
}
```


When the machine stops dispensing a liquid, the machine sends this message and the server broadcasts it:
```
{
  "event": "updateProduct",
  "data": {
    "id": string, // product id
    "dispensing": false
  }
}
```
