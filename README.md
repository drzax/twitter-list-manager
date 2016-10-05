# Twitter CLI

A CLI tool for accessing the Twitter REST API.

## Install

```
npm install -g twitter-list-manager
```

## Use

You will need to set up app-specific authorization on Twitter. Go to https://apps.twitter.com/ and add a new app, and get the client token and key. You can then input those by running:

```
tw auth
```

These keys will be stored in a config file called `.twrc` in your user directory, where you can also edit them directly.

See what's possible

```
tw -h
```

You can also use the `-h` flag with any subcommand

```
tw list-add -h
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
