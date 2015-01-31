#!/usr/bin/env bash
rsync -av -C --delete --exclude CNAME --exclude publish.sh ../pupu-panic/src/./ ./
