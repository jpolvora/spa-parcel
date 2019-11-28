import { checkLogin } from '/services/api'
import pubsub from '/pubsub'

export default {
  beforeRender: async () => {
    const result = await checkLogin()
    if (result.error) return '/register'

    const infoMessage = `Olá, ${(result.json && result.json.user && result.json.user.fullName) || 'Erro'}`
    pubsub.publish('showMessage', {
      text: infoMessage,
      title: 'Login',
      icon: 'info'
    })

    return true
  },
  render: ({ html }) => html`
    <div class="container">
      <h1 class="mt-5">Welcome</h1>
      <p class="lead">
        Bem vindo
      </p>
    </div>
  `
}
