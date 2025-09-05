# 🤝 Contribute to the W3Nest Gallery

---

The **W3Nest Gallery** is meant to grow with the community. If you have an idea for an interactive scientific showcase, you can add it as a new **chapter** in this gallery.

You don’t need to be an expert — if you’ve built something interesting with W3Nest, we’d love to see it! 🚀

---

## 📂 Project Template

Each chapter in the gallery is implemented as a standalone ESM module that follows the 
<api-link target="Chapter"></api-link> API specification.
It essentially defines a <ext-link target="mkdocs.Navigation">Navigation</ext-link> object 
from the <ext-link target="mkdocs">mkdocs-ts</ext-link> library, which is mounted to the application.

Each chapter in the gallery is implemented as a standalone module implementing the 
API specification for the module is described by <api-link target="Chapter"></api-link>. 
It essentially defines a <ext-link target="mkdocs.Navigation"></ext-link> object from the library 
<ext-link target="mkdocs"></ext-link> that gets mounted to the application.

To get started quickly, we provide a <github-link target="chapter-template">project template</github-link> 
in the repository.
This template sets up the minimal structure required to:

* define navigation and metadata for your chapter,
* render notebook pages,
* manage assets and placeholders,
* and integrate smoothly with the rest of the gallery.

Here’s a quick overview of the key files included in the template:

| File                 | Purpose                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `setup.py`           | Configures the project, declares dependencies, and generates boilerplate files.             |
| `index.ts`           | Entry point of the chapter: defines `title`, `abstract`, `navigation`, and exports `links`. |
| `config.markdown.ts` | Configures Markdown parsing, placeholders, LaTeX support, and custom widgets.               |
| `config.notebook.ts` | Sets up the notebook environment and default cell options.                                  |
| `links.ts`           | Centralizes cross-links, external links, and GitHub links for the chapter.                  |


Next expandable sections provide a closer look at each of these files and explain their role in the template.

<note level="example" expandable="true" title="setup.py" icon="fas fa-file">

This script defines the toolbox’s configuration and generates boilerplate files.
It acts as **single source of truth** regarding what is bundled, and the associated dependencies. 
It is triggered automatically when running the `setup` script from package.json.

```py
{{templateSetupPy}}
```

* Configures your chapter as a **standalone ESM module**.
* Declares dependencies (runtime, dev, bundled).
* Generates standard project files (`README.md`, `package.json`, etc.) using `generate_template`.
* Sets up a **dev server** so you can test your chapter locally.

You usually won’t need to change much here, except if your chapter requires **specific dependencies** or a different 
dev setup.

</note>

<note level="example" expandable="true" title="index.ts" icon="fas fa-file">

The file is the **entry point** for your chapter, it implements the required interface for a chapter by defining
`navigation`, `title`, `abstract` and `links` variables.

```ts
{{templateIndexTs}}
```

* Defines the **navigation** (`AppNav`) used by W3Nest to mount your chapter in the gallery. It references files 
  (e.g. `home.md`) from the `assets` folder.
* Sets the **title** & **abstract** displayed in the gallery’s table of contents.
* Exports any **links** (like the `contribute` page).

</note>


<note level="example" expandable="true" title="config.markdown.ts" icon="fas fa-file">

This file defines the markdown configuration: placeholders, custom widgets, latex mode, etc.

```ts
{{templateConfigMarkdownTs}}
```

👉 Options available are presented here: <ext-link target="mkdocs.MdParsingOptions"></ext-link>.

</note>

<note level="example" expandable="true" title="config.notebook.ts" icon="fas fa-file">

This file configures the notebook environment.

```ts
{{templateConfigNotebookTs}}
```

👉 Options available are presented here: <ext-link target="mkdocs.NotebookViewParameters"></ext-link>.

</note>

<note level="example" expandable="true" title="links.ts" icon="fas fa-file">

This file centralized the links referenced in the Markdown content.

```ts
{{templateLinksTs}}
```
⚠️ Always prefix your keys with your chapter ID (here using `navId`: the namespace-free package name) 
to avoid name clashes across different chapters.

</note>

---

## ✨ Create a New Chapter

1. **Fork the Gallery Repository**

   * Fork the repo on GitHub (or clone it directly if you already have write access).

2. **Copy the Starter Template**

   * Duplicate the provided **starter project** into a new folder under `src/chapters/`, named after your chapter 
    (e.g. `foo`).

3. **Set Up Your Chapter**

   * Update the **package name** in `package.json` (e.g. `@w3gallery/foo`).
   * Edit **`index.ts`** to customize your chapter’s `title`, `abstract`, and `navigation`.
   * Replace **`home.md`** with your content (add more Markdown pages as needed, but remember to reference them in 
     `navigation`).
   * Adjust **dependencies** in `setup.py` if your chapter requires extra libraries.

4. **Build Your Chapter**

   * Start the local **W3Nest server**.
   * Open the **W3Lab** application 
     (<ext-link target="w3lab">http://localhost:2000/w3lab</ext-link> if running on 
     port `2000`).
   * From **W3Lab**, select your project and run sequentially:
     `setup` → `dependencies` → `build` → `WebPM-PC`.

5. **Register Your Chapter in the Gallery**

   * From the `@w3nest/gallery` project in **W3Lab**, run again:
     `setup` → `dependencies` → `build` → `WebPM-PC`.
   * Open the `@w3nest/gallery` application from the project page (use the <i class="fas fa-play"></i> button at the top).
  
6. **Iterate on Your Chapter**

   * Keep refining your code, Markdown content, and dependencies.
   * When you’re ready for a stable release, bump the version in `package.json` (removing the `-wip` suffix) and rerun 
     the CI, including the **WebPM (remote publish)** step.
   * After publishing a stable version, bump to the next *work-in-progress* (e.g. `0.1.1-wip`) for ongoing development.
     <note level="question" title="Why use `-wip`?" expandable="true">  
     Versions ending with `-wip` disable caching, ensuring the latest source is always retrieved when loading bundles.  
     Only final versions should be published to the remote WebPM ecosystem.  
     </note>  

7. **Submit Your Contribution**

   * Open a **Pull Request** with your new chapter.
   * Or, if you prefer, send an email to **[contact@w3nest.org](mailto:contact@w3nest.org)** to request Slack 
     access and join the **Gallery** channel for discussion.

---

## 📨 Stay Connected

Want to collaborate, get feedback, or discuss ideas before making a PR?
You can join our **Slack workspace**:

📧 Send an email to **[contact@w3nest.org](mailto:contact@w3nest.org)** to request access.
Once added, you can subscribe to the **`#gallery`** channel to chat with others working on contributions.

---

## 🌟 Thank You!

Every contribution helps the gallery grow and makes W3Nest more useful for the community.
We can’t wait to see what you build!
