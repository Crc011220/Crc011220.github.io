---
icon: pen-to-square
date: 2026-02-01
category:
  - Learning Records
tag:
  - Notes
---

# 模型底座接入平台

## 一、统一 API 网关 / 聚合平台

面向多模型接入、统一管理、成本控制的企业级平台。

| 平台 | 特点 | 支持模型 |
|------|------|----------|
| **One-API** | 开源、单文件/Docker 部署，支持密钥管理与二次分发 | OpenAI、Claude、Gemini、DeepSeek、豆包、ChatGLM、文心一言、讯飞星火、通义千问等 |
| **APIPark** | 云原生、高性能 AI 网关，API 申请审批、调用统计、负载均衡、多模型灾备 | 主流 AI 模型 |
| **FastAPI-SDK** | 企业级快速集成，轻量、页面简洁，Docker 一键部署 | OpenAI、Azure、文心一言、讯飞星火、通义千问、智谱 GLM、Gemini、DeepSeek |
| **汇云 API** | 统一 LLM 网关，无需订阅 | 30+ 厂商（OpenAI、Claude、DeepSeek、Qwen、ChatGLM、文心一言等） |
| **老张 API** | 企业级 AI 集成，按量付费、发票支持 | 200+ 大模型 |

---

## 二、主流模型厂商官方接入

### 海外

| 厂商 | 平台/产品 | 接入方式 |
|------|-----------|----------|
| **OpenAI** | API / Azure OpenAI | 官方 API、`langchain-openai` |
| **Anthropic** | Claude API | 官方 API、`langchain-anthropic` |
| **Google** | Vertex AI / Gemini API | `langchain-google-vertexai`、`langchain-google-genai` |
| **AWS** | Bedrock | `langchain-aws` |
| **Microsoft** | Azure AI | `langchain-azure-ai` |
| **Mistral AI** | Mistral API | `langchain-mistralai` |
| **xAI** | Grok API | `langchain-xai` |
| **Groq** | 推理加速 | `langchain-groq` |
| **Cohere** | Cohere API | `langchain-cohere` |
| **Perplexity** | 搜索增强 | `langchain-perplexity` |

### 国内

| 厂商 | 平台 | 接入方式 |
|------|------|----------|
| **阿里云** | 通义千问 (Qwen)、百炼 | 阿里云控制台、OpenAI 兼容接口 |
| **百度** | 文心一言、千帆大模型平台 | 百度智能云 qianfan.baidu.com、`baidu-aip` |
| **腾讯云** | 混元、豆包 | 腾讯云控制台 |
| **智谱 AI** | ChatGLM、GLM-4 | 智谱开放平台、OpenAI 兼容 |
| **科大讯飞** | 星火大模型 | 讯飞开放平台 |
| **DeepSeek** | DeepSeek-V3、R1 | 官网 API、阿里云百炼、腾讯云，OpenAI 兼容 |
| **月之暗面** | Kimi | 官网 API |
| **硅基流动 (SiliconFlow)** | 一站式大模型云服务 | cloud.siliconflow.cn，OpenAI 兼容 (`base_url: https://api.siliconflow.com/v1`)，部分模型免费 |

**硅基流动** 特点：
- 支持 Qwen2.5、DeepSeek-V2.5、InternLM2.5、图片生成、向量、重排序等
- Qwen2.5-7B 等多款模型免费
- 按量付费、流式输出、Function Calling、JSON 模式、模型微调、批量推理

---

## 三、开源 / 自托管方案

| 方案 | 说明 | 适用场景 |
|------|------|----------|
| **Ollama** | 本地运行 LLaMA、Qwen、DeepSeek 等 | 本地开发、隐私数据 |
| **Hugging Face** | 模型托管、Inference API | 开源模型、自定义部署 |
| **vLLM / Text Generation Inference** | 高性能推理服务 | 自建推理集群 |
| **ModelScope** | 魔搭社区，模型与算力 | 国内模型下载、云端 Notebook |
| **LiteLLM** | 统一封装 100+ 模型 API | 多模型切换、代理 |

---

## 四、开发框架集成

### LangChain 生态

LangChain 提供 1000+ 集成，常用模型包：

| 包名 | 模型 |
|------|------|
| `langchain-openai` | GPT、Embedding |
| `langchain-anthropic` | Claude |
| `langchain-google-genai` | Gemini |
| `langchain-aws` | Bedrock |
| `langchain-deepseek` | DeepSeek |
| `langchain-ollama` | Ollama 本地模型 |
| `langchain-litellm` | 多模型统一（LiteLLM） |

### Java 生态

| 框架 | 说明 |
|------|------|
| **Spring AI** | Spring 生态，单模型快速集成 |
| **LangChain4j** | 多模型、动态切换，支持 Function Call、RAG |

---

## 五、选型建议

| 场景 | 推荐方案 |
|------|----------|
| 快速原型、单模型 | 直接接官方 API（OpenAI、通义、文心等） |
| 多模型切换、成本优化 | One-API、APIPark、LiteLLM |
| 企业级、审批与统计 | APIPark、老张 API |
| 本地/隐私敏感 | Ollama、自建 vLLM |
| 框架集成 | LangChain + `langchain-*`、Spring AI、LangChain4j |
| 国产模型为主 | 通义、文心、智谱、DeepSeek 官方或千帆/百炼等平台 |
| 开源模型 + 低成本 | 硅基流动（Qwen、DeepSeek、InternLM 等，部分免费） |

---

## 参考链接

- [硅基流动 SiliconFlow](https://cloud.siliconflow.cn/) · [文档](https://docs.siliconflow.cn/)
- [LangChain Integrations](https://docs.langchain.com/oss/python/integrations/providers/overview)
- [One-API GitHub](https://github.com/songquanpeng/one-api)
- [百度千帆大模型平台](https://qianfan.baidu.com)
- [DeepSeek API](https://platform.deepseek.com)
