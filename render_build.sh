#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

python -m pip install pipenv
python -m pipenv install --deploy

python -m pipenv run upgrade
