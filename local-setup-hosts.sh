#!/bin/bash

function insert_domain {
  if cat /etc/hosts | grep -q $1
  then
    echo "✅ $1 found in /etc/hosts"
  else
    echo "➡️ $1 not found in /etc/hosts"
    sudo sh -c "echo \"127.0.0.1 $1\" >> /etc/hosts"
    echo "✅ $1 added to /etc/hosts"
  fi
}

insert_domain 'stremio-web-proxy.local'
