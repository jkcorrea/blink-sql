#!/bin/bash
set -e

function log {
  cat - | while read -r message; do
    echo "$1$message"
  done
}

function log_err {
	echo "$@" >&2
}

function script_failure {
	log_err "An error occurred$([ -z "$1" ] && " on line $1" || " (unknown)")."
	log_err "Setup failed."
}

trap 'script_failure $LINENO' ERR

echo "Setting up this system for Blink SQL development."
echo

# Ensure src-tauri exists in the root of the repository
if [ ! -d src-tauri ]; then
  log_err "This script must be run from the root of the Blink SQL repository."
  exit 1
fi

if ! command -v cargo >/dev/null; then
	log_err "Rust was not found. Ensure the 'rustc' and 'cargo' binaries are in your \$PATH."
	exit 1
fi

if [ "${BLINK_SKIP_PNPM_CHECK:-'false'}" != "true" ]; then
	echo "Checking for pnpm..."

	if ! command -v pnpm >/dev/null; then
		log_err "pnpm was not found. Ensure the 'pnpm' command is in your \$PATH."
		log_err 'You MUST use pnpm for this project; yarn and npm are not allowed.'
		exit 1
	else
		echo "Found pnpm!"
	fi
else
	echo "Skipping pnpm check."
fi

echo


function make_usql {
  if ! command -v go >/dev/null; then
    log_err "Go was not found. Ensure the 'go' binary is in your \$PATH."
    exit 1
  fi

  TARGET=$(rustc -Vv | grep host | cut -f2 -d' ')
  USQL_OUTFILE=$(pwd)/src-tauri/binaries/usql/usql-$TARGET
  # TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
  TMP_DIR=$(go env GOPATH)/usql-$RANDOM
  echo "Cloning usql from GitHub..."
  git clone https://github.com/xo/usql.git $TMP_DIR
  cd $TMP_DIR

  echo "BUILD:"
  (set -x;
    go build \
      -trimpath \
      -o $USQL_OUTFILE
  ) 2>&1 | log '    '

  # Remove the temporary directory
  rm -rf $TMP_DIR

  # NOTE: if we want to compress the binary:
  # Use upx to reduce the binary size
  # upx $OUTFILE

  # COMPRESSED=$(upx -q -q $BIN|awk '{print $1 " -> " $3 " (" $4 ")"}')
  # echo "COMPRESSED:  $COMPRESSED"
}

make_usql

echo "Done!"
