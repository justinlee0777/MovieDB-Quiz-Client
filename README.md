##################################

Author: Justin Lee

This is the front-end for a quiz that uses The Movie Database's (TMDb's) API to generate questions.
Pressing the topmost button will generate a quiz from the most popular movies taken from the API.
Providing an actor's name and pressing the bottom input will generate a quiz from that actor's filmography.

'../src/config/config.json':
{
	'backendUrl': configures where the client makes the HTTP calls to
}

To run:
> npm install

> gulp launch

To run in development mode:
> gulp serve