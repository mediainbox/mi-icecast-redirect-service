
# Using NodeJs Version 11.3.0

-- Setup

1) enviroment variables
    PORT=7979
    TOKEN=token
	REDIS_URL=url

2) npm install
3) npm start

-- Requeriment

1) Setup server group

Url:  /setup
Method: POST
Content-Type: applicacion/json
Body:

{
	"token": "token",
	"groups": [
		{
			"name": "mi-01",
			"priority": 1,
			"host": "host_to_XML",
			"interval": 60,
			"listenerHost": "host",
			"status": "online",
			"sourceHost": "host",
			"type": "ice",
			"credentials": {
			   "user": "user",
			   "password": "password"
			}
		},
		{
			"name": "mi-01",
			"priority": 2,
			"host": "host_to_XML",
			"interval": 60,
			"listenerHost": "host",
			"status": "online",
			"sourceHost": "host",
			"type": "sm",
			"credentials": {
			   "user": "user",
			   "password": "password"
			}
		}
	]
}

Example URLS:
http://localhost:7979/http/8000/mi-01/example.mp3

With SSL
http://localhost:7979/https/443/mi-01/example.mp3