#!/usr/bin/env bash

here=$(dirname "$0")
docker build -t myblog "$here/.."
