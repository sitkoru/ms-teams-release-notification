import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import axios from 'axios'
import moment from 'moment-timezone'

export async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token', {required: true})
    const msTeamsWebhookUri: string = core.getInput('ms-teams-webhook-uri', {
      required: true
    })

    const notificationColor = core.getInput('notification-color') || '0b93ff'
    const timezone = core.getInput('timezone') || 'UTC'

    const timestamp = moment()
      .tz(timezone)
      .format('dddd, MMMM Do YYYY, h:mm:ss a z')

    const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')
    const sha = process.env.GITHUB_SHA || ''
    const runId = process.env.GITHUB_RUN_ID || ''
    const tag = process.env.GITHUB_REF?.replace('refs/tags/', '') || ''
    const params = {owner, repo, ref: sha}
    const repoName = `${params.owner}/${params.repo}`
    const repoUrl = `https://github.com/${repoName}`

    const octokit = new Octokit({auth: `token ${githubToken}`})
    const release = await octokit.repos.getReleaseByTag({owner, repo, tag})
    const summary = `New release of ${repoName}: ${tag}`

    const messageCard = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary,
      themeColor: notificationColor,
      title: summary,
      sections: [
        {
          activityTitle: release.data.body,
          activityImage: release.data.author.avatar_url,
          activitySubtitle: `by ${release.data.author.login} [(@${release.data.author.login})](${release.data.author.html_url}) on ${timestamp}`
        }
      ],
      potentialAction: [
        {
          '@context': 'http://schema.org',
          target: [`${repoUrl}/releases/tag/${tag}`],
          '@type': 'ViewAction',
          name: 'Release page'
        },
        {
          '@context': 'http://schema.org',
          target: [`${repoUrl}/actions/runs/${runId}`],
          '@type': 'ViewAction',
          name: 'Workflow page'
        }
      ]
    }

    try {
      await axios.post(msTeamsWebhookUri, messageCard)
    } catch (error) {
      core.debug(error)
      core.setFailed(error.message)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
