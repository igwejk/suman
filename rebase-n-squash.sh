#!/usr/bin/env bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" == "dev" && "$BRANCH" == "master" ]]; then
    echo 'Aborting script because you are on master or dev branch.';
    exit 1;
fi


git add . &&
git add -A &&
git commit -am "final commit before rebase" &&
git fetch origin &&
git checkout dev &&
git pull &&
git checkout ${BRANCH} &&
git branch -D copy_branch
git checkout -b copy_branch &&
git checkout ${BRANCH} &&
git rebase dev &&
git reset --soft dev &&
git add . &&
git add -A &&
git commit -am --allow-empty "set:dev" &&
git push
