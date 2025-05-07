---
icon: pen-to-square
date: 2025-05-07
category:
  - Learning Records
tag:
  - Programmer cliché
---

# Cloudflare

### Practice
- Sucessfully deployed Resume on [Resume-EN](https://cv.rcchen.dpdns.org/) and [Resume-CN](https://cv.rcchen.dpdns.org/cn). The domain name is free from [digitalplat](https://dash.domain.digitalplat.org/), and used Workers and Pages in CloudFlare to deploy.


### Basic Intro

Cloudflare is a company that provides **website and network service acceleration and security protection**. Its services are mainly focused on the following aspects:

---

### 🌐 1. **CDN（Content Delivery Network）**

Cloudflare caches your website content on hundreds of servers worldwide, allowing users to access content from the nearest node, thereby:

* Accelerating website access speed
* Reducing the load on the main server

---

### 🔒 2. **DDoS Protection**

Cloudflare can identify and block **Distributed Denial of Service (DDoS)** attacks, protecting your website from being overwhelmed by malicious traffic.

---

### 🔐 3. **Website Security Protection**

* Automatically enables **HTTPS（SSL/TLS）** for websites
* Provides **Web Application Firewall (WAF)**
* Blocks SQL injection, cross-site scripting, and other common attacks
* Prevents crawling and brute-force login attempts

---

### 🚀 4. **Performance Optimization**

* Compresses HTML, CSS, JS
* Automatically optimizes images
* Supports HTTP/2, HTTP/3, caching rules, etc.

---

### 📡 5. **DNS Resolution Service**

Cloudflare offers the world's fastest public DNS service (such as `1.1.1.1`), as well as high-performance domain name resolution services (suitable for website binding).

---

### 💻 6. **Zero Trust Security Access**

For enterprises, Cloudflare also provides **Zero Trust network access control**, used to protect internal applications, replacing traditional VPNs.

---

### Example

If you use Cloudflare to protect your website:

* When users access your website, they first reach Cloudflare nodes
* Cloudflare checks if it's malicious traffic (such as attacks, crawlers)
* If it's a normal user, it accelerates access and returns cached content
* If the content is expired or dynamic, it fetches data from the source

---

