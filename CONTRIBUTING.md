# Contribution Guide

## Local development notcms-kit

```bash
cd packages/notcms-kit

# if first time, you may need to run also:
# pnpm config set prefix ~/.pnpm-global
pnpm link --global

# watch the changes while you code
pnpm watch
```

In case you want to remove from global

```sh
pnpm remove --global notcms-kit
```

Make sure to check before submitting a PR.

```sh
pnpm check
```
