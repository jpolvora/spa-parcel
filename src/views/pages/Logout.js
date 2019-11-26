import pubsub from '/pubsub'

export default {
  render: ({ html }) => html`
    <div class="container">
      <h1 class="mt-5">Logout</h1>
      <p class="lead">You've been logged out</p>
      <p>Back to <a href="#/">Login</a></p>
    </div>
  `,
  after_render: () => {
    pubsub.publish('login', false)
  }
}
