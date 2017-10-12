Microservice Public Proxy
=========================

Acts as a public endpoint for other services filtering out what could be submitted.

Example case:
- You have a http://10.0.1.1:8000/search/{query} endpoint and you want to expose it, but only on specified payload content

```
{
    "type": "mpp_match(article|event)"
}
```
