---
tags:
  - shell
  - proxy
id: 20251118172332
created: 2025-11-18
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
---
```shell
# ==== Proxy switch ====
PROXY_HOST=127.0.0.1
PROXY_PORT=7890

proxy_on() {
  export HTTP_PROXY="http://$PROXY_HOST:$PROXY_PORT"
  export HTTPS_PROXY="http://$PROXY_HOST:$PROXY_PORT"
  export http_proxy="http://$PROXY_HOST:$PROXY_PORT"
  export https_proxy="http://$PROXY_HOST:$PROXY_PORT"
  export ALL_PROXY="socks5://$PROXY_HOST:$PROXY_PORT"
  export all_proxy="socks5://$PROXY_HOST:$PROXY_PORT"
  echo "Proxy ON -> $PROXY_HOST:$PROXY_PORT"
}

proxy_off() {
  unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy
  echo "Proxy OFF"
}

proxy_status() {
  if env | grep -qi '^http_proxy\|^https_proxy\|^all_proxy'; then
    echo "Proxy is ON:"
    env | grep -i 'proxy'
  else
    echo "Proxy is OFF"
  fi
}

proxy() {
  case "$1" in
    on) proxy_on ;;
    off) proxy_off ;;
    status) proxy_status ;;
    *)
      echo "Usage: proxy {on|off|status}"
      ;;
  esac
}
# ==== Proxy switch end ====
```

# References

# Link to