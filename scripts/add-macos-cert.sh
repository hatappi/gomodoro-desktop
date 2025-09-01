#! /bin/bash

set -eo pipefail

${MACOS_CERT_P12_BASE64:?MACOS_CERT_P12_BASE64 is not set}
${MACOS_CERT_PASSWORD:?MACOS_CERT_PASSWORD is not set}

MACOS_CERT_P12_FILE=certificate.p12
echo -n "$MACOS_CERT_P12_BASE64" | base64 -d > "$MACOS_CERT_P12_FILE"

KEY_CHAIN=build.keychain

security create-keychain -p actions $KEY_CHAIN
# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN
# Unlock the keychain
security unlock-keychain -p actions $KEY_CHAIN
# Import the certificate
security import $MACOS_CERT_P12_FILE -k $KEY_CHAIN -P "$MACOS_CERT_PASSWORD" -T /usr/bin/codesign;
# Set the partition list
security set-key-partition-list -S apple-tool:,apple: -s -k actions $KEY_CHAIN

# Debugging to show the certificate
security find-identity
# Remove certs
rm -fr *.p12