---
icon: pen-to-square
date: 2025-06-05
category:
  - Learning Records
tag:
  - AI
---

# Create MCP Server
```python
# server.py
from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("Demo")


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

## STDIO, SSE, Streamable HTTP
- STDIO: user download the server and run it locally
- SSE: user connect to the server through a URL remote invocation, need to deploy the server
- Streamable HTTP: user connect to the server through a URL remote invocation, need to deploy the server
- Change the transport to "sse" to use SSE, "streamable_http" to use Streamable HTTP

## How to publish MCP Server
- STDIO: deploy the py code to pypi
- Others: deploy the server to a cloud service

