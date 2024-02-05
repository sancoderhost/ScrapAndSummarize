#!/bin/bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Why is the sky blue?",
  "stream":false
}'

echo '\second output'
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Why is the sky red in evening ?",
  "stream":false
}'


