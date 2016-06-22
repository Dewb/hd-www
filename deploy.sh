#!/bin/sh
aws --profile hybridd s3 sync . s3://l--l--l--l--l.hybriddecliners.com --exclude '.git*' --exclude `basename "$0"` --acl "public-read"
