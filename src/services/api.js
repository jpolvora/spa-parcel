import wretch from 'wretch'
import pubsub from '/pubsub'

const delay = ms => new Promise(res => setTimeout(res, ms))

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
    json: false,
    status: 0
  }

  pubsub.publish('busy', true)

  await delay(3000)

  await externalApi
    .url(url)
    .options({
      credentials: 'include'
    })
    .get()
    .json(json => {
      console.debug(json)
      result.success = json.success
      result.error = false
      result.json = json
    })
    .catch(error => {
      console.error(error)
      result.success = false
      result.error = error
      result.json = false
    })

  pubsub.publish('busy', false)

  return result
}

async function postJson(url, token = '', body = {}) {
  const result = {
    success: false,
    error: false,
    json: false,
    status: 0
  }
  pubsub.publish('busy', true)

  await externalApi
    .url(url)
    .options({
      credentials: 'include'
    })
    .body(body)
    .post()
    .headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'x-csrf-token': token
    })
    .response(res => {
      result.status = Number(res.status) || 0
    })
    .json(json => {
      console.debug(json)
      result.success = json.success
      result.error = false
      result.json = json
    })
    .catch(error => {
      console.error(error)
      result.success = false
      result.error = error
      result.json = false
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
