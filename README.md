# Notifier

This project allows sending notifications to multiple destinations. Currently only discord is supported.

## Architecture

The project is a webserver which exposes REST endpoints to create notifications and destinations. The project also consumes a queue to send the notifications to the destinations.
