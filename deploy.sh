#!/bin/sh
aws --profile hybridd s3 sync . s3://hybriddecliners.com --exclude '.git*' --exclude `basename "$0"` --acl "public-read"
