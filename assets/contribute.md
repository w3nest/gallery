# 🤝 Contribute to the W3Nest Gallery

---

The **W3Nest Gallery** is meant to grow with the community. If you have an idea for an interactive scientific showcase, you can add it as a new **chapter** in this gallery.

You don’t need to be an expert — if you’ve built something interesting with W3Nest, we’d love to see it! 🚀

---

## 📂 Project Template

Each chapter in the gallery is implemented as a standalone **ESM module**, which ensures it can be reused, adapted, and extended.

To get started quickly, we provide a **template project** in the repository:

<note level="info" title="Template Location">  
The template is available under [`/templates/chapter`](https://github.com/w3nest/w3gallery/tree/main/templates/chapter).  
</note>  

Use this template as the base for your own chapter by copying it into a new folder and adapting:

* `title` and `abstract` in the metadata
* Your code cells, components, and notes
* Any example datasets, utils, or backend calls

---

## 🌱 How to Contribute

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your chapter:

   ```bash
   git checkout -b feature/my-new-chapter
   ```
3. Copy the template project and rename it.
4. Implement your chapter using the template as a guide.
5. **Commit your changes** and push your branch:

   ```bash
   git push origin feature/my-new-chapter
   ```
6. Open a **Pull Request (PR)** against the `main` branch of the gallery repo.

---

## 📨 Stay Connected

Want to collaborate, get feedback, or discuss ideas before making a PR?
You can join our **Slack workspace**:

📧 Send an email to **[contact@w3nest.org](mailto:contact@w3nest.org)** to request access.
Once added, you can subscribe to the **`#gallery`** channel to chat with others working on contributions.

---

## ✅ Contribution Checklist

Before opening your PR, please make sure that:

* [ ] You have updated the `chapterInputs` mapping with your new chapter.
* [ ] Your code runs correctly in both **notebook** and **app** contexts.
* [ ] You included a **title**, **abstract**, and **links** (if relevant).
* [ ] You tested the notebook locally using the **W3Nest local server** if your chapter requires a backend.

---

## 🌟 Thank You!

Every contribution helps the gallery grow and makes W3Nest more useful for the community.
We can’t wait to see what you build!
