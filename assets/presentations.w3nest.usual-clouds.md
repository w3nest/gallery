
# Challenges with Cloud-Based Platforms

---

<note level="hint" title="The Hidden Complexity of Cloud Platforms">  

Cloud platforms offer scalability and convenience, but they also introduce **significant overhead**—from infrastructure
management to access control and pricing models.  
What should be a straightforward deployment often becomes a **complex and costly process**, limiting flexibility
and accessibility.  

</note>
---

Current cloud platforms (AWS, Google Cloud, Azure, OVH, etc.) introduce significant **accidental complexity**:

* **Restricted Backend Deployment**: Only administrators can deploy services. 
   Most cloud providers do not offer a straightforward way for individual users to deploy their own backends because:

   *  It requires **orchestrating multiple layers of infrastructure** (containers, databases, networking, security).

   *  There is **no default mechanism** for automatically assigning personal backend instances to users.

   *  Ensuring **scalability, security, and cost-efficiency** simultaneously is a non-trivial engineering challenge.

* **Scalability Challenges**:  Even though backends often serve a single user, they require concurrent instances for 
  scaling.

* **Cost & Resource Management**:

  * Who pays for scaling thousands of services?
  
  * How to balance availability and affordability?

* **Data Privacy Concerns**:

  * Deployed backends require published data, but security concerns can forbid this.

  * Most often scientists produce their input data on their computer, publishing them is just to make them available
    to the backends.

* **Developer Workflow Issues**:

  * Scientists and engineers often work on local machines.

  * Proper testing requires **cloud deployment and remote debugging**, adding friction.

---

