#!/bin/bash
cd /home/kavia/workspace/code-generation/savelite-22870-db24e38a/save_lite
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

