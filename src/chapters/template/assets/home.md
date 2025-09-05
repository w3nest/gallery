# Welcome To `{{package-name}}`
<!-- string like {{package-version}} are placeholders, see `config.markdown.ts` -->
<code-badges version="{{package-version}}" github="w3nest/gallery/chapters/template" license="mit">
</code-badges>

--- 

This project serves as the **starter template** for creating new chapters in the @w3nest/gallery application.

It demonstrates the common workflow of writing **notebook-like pages** in a minimal setup. 
Out of the box, it provides a single example page, with the full source code available 
<github-link target="{{navId}}.home.md">here</github-link>.

To extend this template—adding more pages, features, or customizations—refer to the official 
<ext-link target="{{navId}}.mkdocs-ts">mkdocs-ts documentation</ext-link>.

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
