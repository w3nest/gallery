
# **A New Approach**  

---

<note level='hint' title="Rethinking Execution">
Why introduce unnecessary complexity? Instead of **routing a user’s action through a centralized cloud**, 
managing sessions across distributed infrastructure, and dealing with scalability constraints—let’s **simplify**.
</note>

---

## **Backends on PC**  

Instead of running in a centralized cloud, W3Nest backends execute **locally**, **where they are used**. 
This brings several advantages:  

✅ **Familiar local development experience** – Recover **traditional tool development**: build for a single user 
without worrying about cloud scalability. All assets in your local PC can be consumed.

✅ **No cloud costs** – Eliminates the need for paid cloud hosting.

✅ **Data remains local** – Users control which data is published online.

✅ **Faster development cycles** – The entire infrastructure runs **locally**, reducing the need for
remote testing and deployment.

✅ **Offline capability** – No internet required unless updates are needed.  

---

## **How It Works**  

- Users install W3Nest via `pip install w3nest` and ensure **Docker is available** (widely supported today).  
- The first time a resource (ESM, backends, data, web apps, *etc.*) is requested, it is **automatically installed**.  
- W3Nest emulates an **"online" experience** while running everything locally.  

---

| Feature          | Traditional Cloud                     | W3Nest (Local + Cloud Hybrid)           |
| ---------------- | ------------------------------------- | --------------------------------------- |
| **Deployment**   | Centralized, admin-controlled         | Decentralized, user-controlled          |
| **Cost**         | Paid cloud instances                  | Free (local execution)                  |
| **Scalability**  | Complex, requires orchestration       | Automatic, per-user clusters            |
| **Data Privacy** | Requires online data                  | Fully local, user decides what to share |
| **Development**  | Remote debugging, deployment overhead | Local-first, easy testing               |
| **Offline Use**  | Requires constant connectivity        | Works offline, except for updates       |
