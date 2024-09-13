#!/usr/bin/env bash

set -uxo

DEBUG=${DEBUG:-0}

function run_liquibase() {
  local uri
  local password
  local seed
  uri="${1}"
  password="${2}"
  seed="${3:-0}"

  local label
  if [ "${seed}" -eq 0 ]; then
    label='!seed'
  else
    label='seed'
  fi

  local extra
  if [ "${DEBUG}" -ne 0 ]; then
      extra='--log-level=FINE '
  else
      extra=''
  fi

  liquibase "${extra}update" \
    --changelog-file ./graph/main.xml \
    --url "jdbc:neo4j:$uri" \
    --username neo4j \
    --password "${password}" \
    --label-filter "${label}"
}

if [ "$#" -lt 2 ]; then
  >&2 echo "Error: not enough arguments provided"
  >&2 echo "Usage:"
  >&2 echo "${0} <URI> <PASSWORD> [<SEED (0|1, default: 0)>]"
  exit 1
fi

run_liquibase "${@}"
