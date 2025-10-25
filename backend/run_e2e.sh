#!/bin/bash
cd "$(dirname "$0")"
export PYTHONPATH=/Users/rurek/private/co-sie-dzieje-w-polsce/backend
source app/venv/bin/activate
python -m pytest tests/e2e/ -v --tb=short