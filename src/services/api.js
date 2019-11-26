import wretch from 'wretch'
import pubsub from '/pubsub'

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

export const checkLogin = async () => {
  const result = {
    success: false,
    error: false
  }
  //debugger
  pubsub.publish('busy', true)
  await externalApi
    .url('/api/user/check')
    .get()
    .json(json => {
      console.debug(json)
      result.success = json.success
    })
    .catch(error => {
      console.error(error)
      result.error = error
    })

  pubsub.publish('busy', false)

  return result
}

export const getToken = async () =>
  new Promise(resolve =>
    externalApi
      .url('/login')
      .get()
      .json(json =>
        resolve({
          success: json.token || false,
          token: json.token || '',
          error: false
        })
      )
      .catch(error => {
        resolve({
          success: false,
          error
        })
      })
  )

export const execLogin = async (username, password, csrf) => {
  const url = `${process.env.API_URL}/api/user/login`
  let response = undefined
  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'x-csrf-token': csrf
      },
      body: JSON.stringify({
        username,
        password,
        _csrf: csrf
      })
    })

    const json = await response.json()
    const success = Number(response.status) === 200 && json.success
    return {
      success: success,
      message: success ? 'ok' : JSON.stringify(json)
    }
  } catch (err) {
    return {
      success: false,
      message: err
    }
  }
}
