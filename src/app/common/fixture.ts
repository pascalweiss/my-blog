import { Entry } from './entry';

export const  fixture: Entry[] =  [
    {
        date: "sdf",
        content: `
        ---
__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!

---
        `,
        title: "article 1"
    },
    {
        date: "sdf",
        content: `
        # h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

        `,
        title: "article 2"
    },
    {
        title: "Nanis Blog Artikel", 
        date: "heute", 
        content: "Nani will ins Bett!!!"
    }
]