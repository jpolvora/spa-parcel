import ko from 'knockout'

const viewModel = function () {
  return {
    email: ko.observable('').extend({ email: true, required: true }),
    pass1: ko.observable().extend({ required: true, minLength: 6, maxLength: 12 }),
    pass2: ko.observable().extend({ required: true, minLength: 6, maxLength: 12 }),

    validate: function (formEl) {
      console.log(formEl)
      if (!this.email.isValid()) return alert('email inválido')
      if (!this.pass1.isValid()) return alert('pass1 inválido')
      if (!this.pass2.isValid()) return alert('pass1 inválido')

      if (this.pass1() !== this.pass2()) return alert('senhas diferem')
      return alert('tudo ok')
    }
  }
}

const Register = {
  render: async () => {
    return /*html*/ `
        <form data-bind="submit: validate">
            <section class="section">
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" type="email" data-bind="value: email" placeholder="Enter your Email">
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" type="password" data-bind="value: pass1" placeholder="Enter a Password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" data-bind="value: pass2" type="password" placeholder="Enter the same Password again">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-primary">
                        Register
                        </button>
                    </p>
                </div>

            </section>
            </form>
        `
  },
  // All the code related to DOM interactions and controls go in here.
  // This is a separate call as these can be registered only after the DOM has been painted

  after_render: async (root) => {
    ko.applyBindings(viewModel, root)
  }
}

export default Register