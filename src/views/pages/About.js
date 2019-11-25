import { html } from 'common-tags'

const About = {
  render: async () => {
    return html`
    <div class="container">
      <section class="section mt-5">
          <h1> About </h1>
      </section>
    </div>
        `
  },
  after_render: async () => { }

}

export default About