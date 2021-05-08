#!/bin/bash

set -euo pipefail

COMMIT_ID=$(git rev-parse --short HEAD)

git checkout gh-pages
rm -r ../site && cp -r build/ ../site
git add ../site
git commit -m "Deployment for commit $COMMIT_ID"
git push origin gh-pages
git checkout master

echo "Deployed commit $COMMIT_ID"
