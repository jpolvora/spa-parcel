const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

export const getPostsList = async () => {
  try {
    const response = await fetch('https://5bb634f6695f8d001496c082.mockapi.io/api/posts', options)
    const json = await response.json()
    return json
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

export const getPost = async id => {
  try {
    const response = await fetch('https://5bb634f6695f8d001496c082.mockapi.io/api/posts/' + id, options)
    const json = await response.json()
    // console.log(json)
    return json
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

export const checkLogin = async () => {
  let error = false
  try {
    const url = `${process.env.API_URL}/api/user/check`
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

    const response = await fetch(url, fetchOptions)
    if (response.status === 200) {
      const json = await response.json()
      return {
        status: (response && Number(response.status)) || 200,
        success: !!json.success,
        message: json.message || ''
      }
    }
  } catch (err) {
    error = err
  }

  return {
    success: false,
    message: error
  }
}

export const getToken = async () => {
  const url = `${process.env.API_URL}/login`
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

    const response = await fetch(url, fetchOptions)
    if (response.status === 200) {
      const json = await response.json()
      return json.token || false
    }
    return false
  } catch (err) {
    console.error(err)
    return false
  }
}

export const execLogin = async (username, password, csrf) => {
  const url = `${process.env.API_URL}/api/user/login`
  let response = undefined
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'x-csrf-token': csrf
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    const json = await response.json()
    return {
      status: (response && Number(response.status)) || 200,
      success: !!json.success,
      message: json.message || ''
    }
  } catch (err) {
    return {
      status: (response && Number(response.status)) || 500,
      success: false,
      message: err
    }
  }
}
