#!/usr/bin/env bash

rm -rf optimized; mkdir optimized;

for f in *.mp3; do
  echo "Processing $f ...";
  basename=${f%.mp3}
  ffmpeg -i $f -c:a libfdk_aac -b:a 128k optimized/${basename}.m4a;
  ffmpeg -i $f -c:a libvorbis  -b:a 128k optimized/${basename}.ogg;
done
