build:
	sudo docker build -t wequiz-model:latest --target app .

run:
	sudo docker run -d \
	-e AWS_ACCESS_KEY_ID= \
	-e AWS_SECRET_ACCESS_KEY= \
	-p 8000:7999\
	-v ~/workspace/wequiz/model/app:/app \
	--restart always \
	--name wequiz-model wequiz-model

stop:
	sudo docker stop wequiz-model
	sudo docker rm wequiz-model

exec:
	sudo docker exec -it wequiz-model /bin/bash

log:
	sudo docker logs -f wequiz-model