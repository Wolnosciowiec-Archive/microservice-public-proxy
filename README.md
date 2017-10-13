Microservice Public Proxy
=========================

Acts as a firewall-proxy between world and microservices.
Exposes only specified endpoints, **even is able to filter by JSON payload**.

Example case:
- You have a http://10.0.1.1:8000/search/{query} endpoint and you want to expose it, but only on specified payload content

```
{
    "type": "_@mpp_match((article|event))"
}
```

Let's assume your application accepts **type** with values "article", "event", "users" but you want to expose
only **article** and **event** - our firewall will do this for you and block unexpected values in this field.

## Configuration

Put your configuration files inside of `config` directory, they will be automatically loaded if the extension will be ".xml"

#### Structure

Config -> Match:
  There you can define routing rules, so the firewall will know on which domains and paths to rewrite the url
  and possibly parse the payload.

```
<?xml version="1.0"?>
<definition>
    <config>
        <match type="regexp" pattern="http\:\/\/services\.example\.org\/users\/profile\/view\/(.*)" target="http://127.0.0.1:8002/users/profile/view/$1"/>
    </config>

    <payloads>
        <payload type="json">
            {
                "id": "_@mpp_match(*)",
                "type": "_@mpp_match((user|group))"
            }
        </payload>
    </payloads>
</definition>
```
