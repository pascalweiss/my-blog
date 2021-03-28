#!/usr/bin/env bash

here=$(dirname "$0")
docker build -t my-blog "$here/.."
