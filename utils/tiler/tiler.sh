#!/bin/bash

if [ ! -d "$2" ]; then
  mkdir -p "$2"
fi

python image_fix.py "$1" "$2" && python tiler.py "$2"
