#!/bin/bash

#Install Node
curl --location 'http://localhost:2000/api/v2/packages' \
  --header 'Content-Type: application/json' \
  --data '{
    "language": "node",
    "version": "20.11.1"
  }'

#Install C, C++
#curl --location 'http://localhost:2000/api/v2/packages' \
#  --header 'Content-Type: application/json' \
#  --data '{
#    "language": "gcc",
#    "version": "10.2.0"
#  }'