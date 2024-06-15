import { REST } from '@discordjs/rest'
import { getDiscordToken } from './environmentVariables'
import { API } from '@discordjs/core'

const api = new REST({ version: '10' }).setToken(getDiscordToken())
export const client = new API(api)
