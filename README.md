# react.js in action


## fork a repo to a sub-directory in another repo

fork the repo [react illustration series](https://github.com/7kms/react-illustration-series.git) to the sub-directory `illustration`

```shell
# shortcuts: add the repo react-illustration-series as a remote forked-illustration
#   otherwise please replace forked-illustration with the full URL https://github.com/7kms/react-illustration-series.git
git remote add -f forked-illustration https://github.com/7kms/react-illustration-series.git
git subtree add --prefix illustration forked-illustration master --squash
# 
git fetch forked-illustration master
# 
git subtree pull --prefix illustration forked-illustration master --squash
```

contribute back upstream

```shell
git remote add original-illustration ssh://git@github.com/7kms/react-illustration-series.git
git subtree push --prefix=illustration original-illustration master
```

>refer to https://www.atlassian.com/git/tutorials/git-subtree
