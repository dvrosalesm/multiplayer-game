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

# Authentication

The authentication systems has 3 steps to verify a user.

1. *REST API Login*: First the a request to the authentication API must be issued, containing the nickname of the player to authenticate. The service will return the web socket that the player needs to connecto and an authentication token.
2. *Web Socket Connection*: After successfuly getting a auth token, the user must connect to the provided web socket URL (HTTP Server), and listen for the __askToken__ event which indicates that the server is ready to receive the auth token.
3. *Web Socket Auth*: After receiving the __askToken__ event the user must send a __tokenReceived__ event to the server with the auth token as the first argument, this will authenticate the user and will add it to the server gameboard.  

# TODO Features

## Enable to change the map size

The logic for this behaviour is located on the empty __updateDimensions__ method of the Gameboard class, the method should update the dimensions of the map and the shape. 

The method __moveEntity__ from the same class also needs to be updated to reassure that the logic keeps working even if the shape of the maps change, if the map shape is continuing to be a square no problem should arise.

## Put obstacles in the map

A new type of entity must be created that implements the __Entity__ interface, this will allow the be positioned in a cell of the gameboard, all the restrictions and behaviours of the movement of the obstacle need to be implemented in the __move__ method which uses the strategy design pattern to notify the gameboard to move the entity from its position in an async safe way.

New implementation should be added to manage the effect of the collision between a player and an obstacle, this logic is located on the __runScheduler__ method of the Gameboard class.

## Put coins in the map

As similar as with the obstacles, just taking into consideration how the behaviour for the collision with affect the player in a positive way instead damaging it. The logic for this behaviour can be found inside the __runScheduler__ method of the Gameboard class.