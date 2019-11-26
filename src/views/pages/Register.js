import ko from 'knockout'
import pubsub from '/pubsub'
import { getToken, execLogin } from '/services/api'
import swal from 'sweetalert'

const viewModel = function() {
  return {
    email: ko.observable('').extend({ email: true, required: true }),
    password: ko.observable('').extend({ required: true, minLength: 6, maxLength: 12 }),
    token: ko.observable(''),

    validate: async function() {
      if (!this.email.isValid()) return alert('email inválido')
      if (!this.password.isValid()) return alert('password inválido')
      if (!this.token()) return window.location.reload()
      const loginResult = await execLogin(this.email(), this.password(), this.token())
      if (loginResult.success) {
        pubsub.publish('login', true)
        pubsub.publish('navigate', '/')
      } else {
        console.error(loginResult.message)
        pubsub.publish('login', false)
        await swal({
          title: 'Logon',
          text: loginResult.message || 'Erro login',
          icon: 'error',
          button: 'Ok'
        })
        window.location.reload()
      }
    }
  }
}

export default {
  render: ({ html }) => html`
    <div class="container text-center" id="register">
      <form class="form-signin" data-bind="submit: validate, attr: { 'data-token': token() }">
        <img class="mb-4" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" data-bind="value: email" required autofocus />
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" data-bind="value: password" required />
        <div class="checkbox mb-3">
          <label> <input type="checkbox" value="remember-me" /> Remember me </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
        <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
      </form>

      <style scoped>
        .form-signin {
          width: 100%;
          max-width: 330px;
          padding: 15px;
          margin: auto;
        }
        .form-signin .checkbox {
          font-weight: 400;
        }
        .form-signin .form-control {
          position: relative;
          box-sizing: border-box;
          height: auto;
          padding: 10px;
          font-size: 16px;
        }
        .form-signin .form-control:focus {
          z-index: 2;
        }
        .form-signin input[type='email'] {
          margin-bottom: -1px;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
        .form-signin input[type='password'] {
          margin-bottom: 10px;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      </style>
    </div>
  `,
  after_render: async () => {
    const vm = viewModel()
    ko.applyBindings(vm, document.getElementById('register'))
    const result = await getToken()
    if (result.success && result.token) {
      vm.token(result.token)
    } else {
      await swal({
        title: 'Logon',
        text: 'Offline',
        icon: 'error',
        button: 'Tentar novamente'
      })

      window.location.reload()
    }
  }
}
