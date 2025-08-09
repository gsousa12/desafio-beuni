#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint -s
pnpm typecheck -s