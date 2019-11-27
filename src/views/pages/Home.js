import { checkLogin } from '/services/api'
import pubsub from '/pubsub'

export default {
  render: ({ html }) => html`
    <div class="container">
      <h1 class="mt-5">Welcome</h1>
      <p class="lead">
        Bem vindo
      </p>
    </div>
  `,
  afterRender: async () => {
    const result = await checkLogin()
    if (result.error) {
      const errorMessage = `Ocorreu um erro ao verificar credenciais: ${result.error}`
      pubsub.publish('showMessage', {
        text: errorMessage,
        title: 'CheckLogin',
        icon: 'error',
        callback: () => pubsub.publish('navigate', '/register')
      })
    } else {
      const infoMessage = `Olá, ${(result.json && result.json.user && result.json.user.fullName) || 'Erro'}`
      pubsub.publish('showMessage', {
        text: infoMessage,
        title: 'Login',
        icon: 'info'
      })
    }
  }
}
