---
tags:
  - fish
  - shell
  - archived
id: 20260109214232
created: 2026-01-09 21:42:32
status:
  - done
type: fleet-note
aliases:
  - fish-proxy-script
archived_at: 2026-01-10T22:30:10
---
```shell
# >>> Proxy switch >>>
set -g PROXY_HOST 127.0.0.1
set -g PROXY_PORT 7890

function proxy_on
    set -gx HTTP_PROXY  "http://$PROXY_HOST:$PROXY_PORT"
    set -gx HTTPS_PROXY "http://$PROXY_HOST:$PROXY_PORT"
    set -gx http_proxy  "http://$PROXY_HOST:$PROXY_PORT"
    set -gx https_proxy "http://$PROXY_HOST:$PROXY_PORT"
    set -gx ALL_PROXY   "socks5://$PROXY_HOST:$PROXY_PORT"
    set -gx all_proxy   "socks5://$PROXY_HOST:$PROXY_PORT"
    echo "Proxy ON -> $PROXY_HOST:$PROXY_PORT"
end

function proxy_off
    set -e HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy
    echo "Proxy OFF"
end

function proxy_status
    set -l vars HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy NO_PROXY no_proxy

    set -l on 0
    for v in $vars
        if set -q $v; and test -n "$$v"
            set on 1
        end
    end

    if test $on -eq 0
        echo "Proxy is OFF"
        return
    end

    echo "Proxy is ON:"
    for v in $vars
        if set -q $v
            echo "$v=$$v"
        end
    end | sort
end



function proxy
    switch $argv[1]
        case on
            proxy_on
        case off
            proxy_off
        case status
            proxy_status
        case '*'
            echo "Usage: proxy {on|off|status}"
    end
end
# <<< Proxy switch <<<
```

# References