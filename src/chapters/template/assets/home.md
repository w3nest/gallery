# Welcome To `{{package-name}}`
<!-- string like {{package-version}} are placeholders, see `config.markdown.ts` -->
<code-badges version="{{package-version}}" github="w3nest/gallery/chapters/template" license="mit">
</code-badges>

--- 

This is the starter project to start writing chapters contributing to `@w3nest/gallery` application.

It depicts the usual scenario of writing notebook like pages. 
The project is very simple - it features a single page with source available 
<github-link target="{{navId}}.home.md">here</github-link>.
To go beyond, refer to the documentation of `mkdocs-ts` 
<ext-link target="{{navId}}.mkdocs-ts">here</ext-link>.

Here is a **simple JavaScript cell**:

<js-cell>
display('Hello World')
</js-cell>

Click the <i class='fas fa-play text-success'></i> button to run the cell, or press \`Ctrl+Enter\` inside the cell.

---

### **Explore Different Cell Types**

In addition to JavaScript cells, notebooks support multiple interactive cell types:
- **\`md-cell\`** → Markdown for rich text and formatting
- **\`py-cell\`** → In-Browser Python execution
- **\`interpreter-cell\`** → Custom interpreters for other languages 
- **\`worker-cell\`** → Background task execution

---

### **Reactive from the Ground Up**

Built-in **reactivity** using <ext-link target="template.reactivex">ReactiveX</ext-link> ensures seamless updates
and dynamic content.
