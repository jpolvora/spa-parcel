import { html } from 'common-tags'
import ko from 'knockout'
import pubsub from '/pubsub.js'

const viewModel = function () {
  pubsub.publish('loggedIn', false)

  return {
    email: ko.observable('').extend({ email: true, required: true }),
    pass1: ko.observable('').extend({ required: true, minLength: 6, maxLength: 12 }),
    pass2: ko.observable('').extend({ required: true, minLength: 6, maxLength: 12 }),

    validate: function (formEl) {
      console.log(formEl)
      if (!this.email.isValid()) return alert('email inválido')
      if (!this.pass1.isValid()) return alert('pass1 inválido')
      if (!this.pass2.isValid()) return alert('pass1 inválido')

      if (this.pass1() !== this.pass2()) return alert('senhas diferem')

      pubsub.publish('loggedIn', true)
      return alert('tudo ok')
    }
  }
}

const Register = {
  render: async () => {
    return html`
    <div class="container text-center" id="register">
    <form class="form-signin" data-bind="submit: validate">
    <img class="mb-4" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <label for="inputEmail" class="sr-only">Email address</label>
    <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
    <label for="inputPassword" class="sr-only">Password</label>
    <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me"> Remember me
      </label>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
          
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
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
</div>
        `
  },
  // All the code related to DOM interactions and controls go in here.
  // This is a separate call as these can be registered only after the DOM has been painted

  after_render: async () => {
    ko.applyBindings(viewModel, document.getElementById('register'))
  }
}

export default Register