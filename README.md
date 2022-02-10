# Basic Multiplayer Game

# Model

![Model](https://github.com/dvrosalesm/services-multiplayer-game/blob/main/docs/model.jpg?raw=true)

# REST API

| Endpoint | Description | Parameters|Returns|
|---|---|---|---|
|http://localhost:3000/login|Authentication endpoint|__nickname__  *(required)* Specifies the player's nickname.|status: Status of the request. 200 for ok, other for invalid. <br /> token: Base64 token to authenticate in the http game server. <br /> webSocket: URL of the http game socket.|