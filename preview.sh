#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8080}"

echo "Starting SalonFlow preview server on http://localhost:${PORT}"
echo "Open this URL in your browser and click: טען נתוני דמו"
python3 -m http.server "${PORT}"
