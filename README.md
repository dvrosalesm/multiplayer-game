# Basic Multiplayer Game

# Model

![Model](https://github.com/dvrosalesm/services-multiplayer-game/blob/main/docs/model.jpg?raw=true)

# REST API

| Endpoint | Description | Parameters|Returns|
|---|---|---|---|
|http://localhost:9000/login|Authentication endpoint|__nickname__  *(required)* Specifies the player's nickname.|status: Status of the request. 200 for ok, other for invalid. <br /> token: Base64 token to authenticate in the http game server. <br /> webSocket: URL of the http game socket.|

# Web Sockets

URL: http://localhost:9001

## Server to client events

| Event | Description | Returns |
|---|---|---|
| askToken | Request for authentication token in base64. | |
| invalidToken | Indicates that the given token was invalid. A disconnection is issued after this event. | |
| updateBoard | Notifies that the game board has changed. | A JSON array of the gameboard with nicknames |

## Client to server events

| Event | Description | Message |
|---|---|---|
| tokenReceived | Notifies the server that an authentication token is being sent. | Base64 authentication token |
| move | Requests a player move to the server. | Direction as string: "up", "down", "right", "left" |