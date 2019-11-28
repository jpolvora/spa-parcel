import wretch from 'wretch'
import pubsub from '/pubsub'

const delay = ms => new Promise(res => setTimeout(res, ms))

const safeJson = str => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return false
  }
}

const externalApi = wretch()
  .url(process.env.API_URL)
  .options({
    credentials: 'include',
    mode: 'cors'
  })
  .headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })

async function getJson(url, token = '') {
  console.info('getJson', url, token)
  const result = {
    success: false,
    error: false,
    json: false
  }

  pubsub.publish('busy', true)

  await delay(100)

  await externalApi
    .url(url)
    .get()
    .json(json => {
      console.debug(json)
      result.success = true
      result.error = false
      result.json = json
    })
    .catch(error => {
      const json = (error && error.text && safeJson(error.text)) || {}
      console.error(json || (error && error.text))
      result.success = false
      result.error = error
      result.json = json
    })

  pubsub.publish('busy', false)

  return result
}

async function postJson(url, token = '', body = {}) {
  console.info('postJson', url, token, body)
  const result = {
    success: false,
    error: false,
    json: false
  }

  pubsub.publish('busy', true)

  await delay(100)

  await externalApi
    .url(url)
    .options({
      headers: {
        'x-csrf-token': token
      }
    })
    .body(body)
    .post()
    .json(json => {
      console.debug(json)
      result.success = true
      result.error = false
      result.json = json
    })
    .catch(error => {
      const json = (error && error.text && safeJson(error.text)) || {}
      console.error(json || (error && error.text))
      result.success = false
      result.error = error
      result.json = json
    })

  pubsub.publish('busy', false)

  return result
}

export const checkLogin = () => getJson('/api/user/check')
export const getToken = () => getJson('/login')

export const execLogin = (usuario, senha, token) =>
  postJson('/api/user/login', token, {
    usuario,
    senha
  })
