#!/usr/bin/env bash

here=$(dirname "$0")
pushd "$here/.."
npm run build --prod
popd
# docker build -t my-blog -f "$baseDirRelative/../Dockerfile"