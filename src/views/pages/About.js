import { html } from 'common-tags'

const About = {
  render: async () => {
    return html`
            <section class="section">
                <h1> About </h1>
            </section>
        `
  },
  after_render: async () => { }

}

export default About