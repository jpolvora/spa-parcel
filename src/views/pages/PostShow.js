import { getPost } from '../../services/api'

export default {
  render: async ({ html, params }) => {
    const post = await getPost(params.id)

    return html`
      <section class="section">
        <h1>Post Id : ${post.id}</h1>
        <p>Post Title : ${post.title}</p>
        <p>Post Content : ${post.content}</p>
        <p>Post Author : ${post.name}</p>
      </section>
    `
  }
}
