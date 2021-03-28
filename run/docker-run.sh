#!/usr/bin/env bash

INTERNAL_PORT=80
EXTERNAL_PORT=3000
docker run --name my-blog -d -p 3000:80 my-blog