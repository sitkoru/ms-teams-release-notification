<p align="center">
  <a href="https://github.com/sitkoru/ms-teams-release-notification/actions"><img alt="typescript-action status" src="https://github.com/sitkoru/ms-teams-release-notification/workflows/build-test/badge.svg"></a>
</p>

# Microsoft Teams Release Notification 
A GitHub Action that sends release notifications to a Microsoft Teams channel.

## Usage

1. Add `MS_TEAMS_WEBHOOK_URI` on your repository's configs on Settings > Secrets. It is the [Webhook URI](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) of the dedicated Microsoft Teams channel for notification.

2) Add a new `step` on your workflow code below `actions/checkout@v2`:

```yaml
name: MS Teams Notification

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      # this is the new step using the ms-teams-release-notification action
      - name: Notify about release
        uses: sitkoru/ms-teams-release-notification@v1
        with:
          github-token: ${{ github.token }} # this will use the runner's token.
          ms-teams-webhook-uri: ${{ secrets.MS_TEAMS_WEBHOOK_URI }}
          notification-color: 17a2b8
          timezone: America/Denver
```

3. Configure it with the following inputs:
   - `github-token` - (required), set to the following:
     - `${{ github.token }}`
   - `webhook-uri` - (required), setup a new secret to store your Microsoft Teams Webhook URI (ex. `MS_TEAMS_WEBHOOK_URI`). Learn more about setting up [GitHub Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) or [Microsoft Teams Incoming Webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
   - `notification-color` (optional), Custom color to help distinguish type of notification. Can be any [HEX color](https://html-color.codes/). (ex. **007bff** or **17a2b8** for info, **28a745** success, **ffc107** warning, **dc3545** error, etc.) 
   - `timezone` - (optional, defaults to `UTC`), a [valid database timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), (ex. Australia/Sydney or America/Denver, etc.)

# Authors

- Based on [jdcargile/ms-teams-notification](https://github.com/jdcargile/ms-teams-notification)

