
This repository now includes a "blogpost" document generated from markdown using pandoc

pandoc template, based on index.html -- just set $body$ in the middle per
https://github.com/tonyblundell/pandoc-bootstrap-template/blob/master/template.html

`pandoc blogpost.md -f markdown -t html --template template.html -o blogpost.html`

deploy script:
- recompile the blog post
- push audio
- push the static files