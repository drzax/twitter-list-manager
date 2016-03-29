# Twitter CLI

A CLI tool for accessing the Twitter REST API.

## Install

```
npm install -g twitter-list-manager
```

## Use

Auth with twitter

```
tw auth
```

See what's possible

```
tw -h
```

## Examples

Here are a collection of examples, mostly for my own benefit right now. Eventually they will be moved to a documentation page somewhere.

### `tw raw`

Find out what the `friends/list` endpoint does:

```
tw raw --docs friends/list
```

Cool, now get a list of people you follow:

```
tw raw friends/list
```

But readable:

```
tw raw friends/list --pretty
```

Use [./jq](https://stedolan.github.io/jq/) to just get the parts we want

```
tw raw friends/list | jq [.users[].screen_name]
```
