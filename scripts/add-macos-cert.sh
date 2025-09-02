#! /bin/bash

set -ueo pipefail

MACOS_CERT_P12_FILE=certificate.p12
echo -n "$MACOS_CERT_P12_BASE64" | base64 -d > "$MACOS_CERT_P12_FILE"

KEY_CHAIN=build.keychain

security create-keychain -p actions $KEY_CHAIN
# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN
# Unlock the keychain
security unlock-keychain -p actions $KEY_CHAIN
# Import the certificate
security import $MACOS_CERT_P12_FILE -k $KEY_CHAIN -P "$MACOS_CERT_PASSWORD" -T /usr/bin/codesign > /dev/null;
# Set the partition list
security set-key-partition-list -S apple-tool:,apple: -s -k actions $KEY_CHAIN
# Remove certs
rm -fr *.p12