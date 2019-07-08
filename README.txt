
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
	"token": token,
	"groups": [
		{
			"priority": 1,
			"host": "url/server.xml",
			"interval": 60,
			"status": "online",
			"credentials": {
				"user": "",
				"password": ""
			}
		},
		{
			"priority": 2,
			"host": "url/server.xml",
			"interval": 60,
			"status": "online",
			"credentials": {
				"user": "",
				"password": ""
			}
		}
	]
}