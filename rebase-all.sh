#!/usr/bin/env bash

set -Eeuxo pipefail

REMOTE=${REMOTE:-origin}

function step_number() {
  read -r branch_name
  echo "${branch_name}" | cut -d'-' -f2
}

function update_branch() {
  local current_branch
  local previous_branch
  current_branch="${1}"
  previous_branch="${2}"
  git checkout "${current_branch}"
  git branch --set-upstream-to "${REMOTE}/${current_branch}"
  git pull --rebase
  git rebase "${previous_branch}"
  git push --force-with-lease
}

function main() {
    local current_branch
    local step_branches
    local previous_branch

    current_branch="$(git branch --show-current)"
    trap "git checkout ${current_branch}" EXIT

    git fetch --all
    step_branches=$(git branch --remotes | grep step | cut -d'/' -f 2 | sort --version-sort)

    if [ "${current_branch}" == "start" ]; then
        previous_branch=${current_branch}
        for step_branch in ${step_branches} ; do
            update_branch "${step_branch}" "${previous_branch}"
            previous_branch=${step_branch}
        done
    else
        if [[ ! "${current_branch}" =~ ^step\-[1-9][0-9]*$  ]]; then
          >&2 echo "unsupported pattern for current branch"
          exit 1
        fi
        local current_step_number
        local max_step_number
        local step_num
        local step_branch
        previous_branch=${current_branch}
        current_step_number=$(echo "${current_branch}" | step_number)
        max_step_number=$(echo "${step_branches}" | sort --version-sort | tail -n 1 | step_number)
        for (( step_num=current_step_number+1; step_num<=max_step_number; step_num++ ))
        do
          step_branch="step-${step_num}"
          update_branch "${step_branch}" "${previous_branch}"
          previous_branch=${step_branch}
        done
    fi
}

main
