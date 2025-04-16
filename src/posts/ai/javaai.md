---
icon: pen-to-square
date: 2025-04-08
category:
  - Learning Records
tag:
  - AI
---

# AI API framework for Java

## Spring AI vs. Langchain4J
| Dimension       | Spring AI                         | LangChain4j                      |
|-----------------|-----------------------------------|----------------------------------|
| Technology Stack Binding | Strongly dependent on the Spring ecosystem | No framework dependency, can be used independently |
| Applicable Scenarios    | Rapid integration of Spring Boot applications with single models | Multi-model (dynamic model) platforms |

## Langchain4J
### Functional Call
- For example:
1. 加入回调方法：
```java
@Service
public class ToolsService {
    @Tool("How many names are there in Melbourne?")
    public Integer changshaNameCount(
        @P("name") String name) {
        System.out.println(name);
        return 10;
    }
}
```
- ToolsService is configured as a bean
- @Tool is used to tell AI which dialogue calls this method
- @P("name") is used to tell AI what information needs to be extracted from the dialogue when calling the method, here the name is extracted
2. Combine with the configuration of tools through AiService, here using the Assistant configured in the previous dialogue memory
```java
public interface Assistant {
    String chat(String message); // 流式响应
    TokenStream stream(String message);
}
@Bean
public Assistant assistant(ChatLanguageModel qwenChatModel,
                           StreamingChatLanguageModel qwenStreamingChatModel,
                           ToolsService toolsService) {
    ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
    Assistant assistant = AiServices.builder(Assistant.class)
        .chatLanguageModel(qwenChatModel)
        .streamingChatLanguageModel(qwenStreamingChatModel)
        .tools(toolsService)
        .chatMemory(chatMemory)
        .build();
    return assistant;
}
```
- if more tool is needed, just add more @Tool annotation to the ToolsService


### RAG (Retrieval-Augment-Generation)
- Function call and system message can improve the user experience.
- But if huge amount of data is involved, RAG can provide a more comprehensive and accurate response.

### Vector Database abd Embedding
- Vectors are usually used for similarity search, such as semantic one-dimensional vectors, which can represent the semantic similarity of words or phrases. For example, "hello" and "nice to meet you" can be represented by a one-dimensional vector to indicate their semantic closeness.
- However, for more complex objects, such as dogs, similarity search cannot be done through a single dimension. In this case, we need to extract multiple features, such as color, size, breed, etc., and represent each feature as a dimension of the vector, thus forming a multi-dimensional vector. For example, a brown small Teddy dog can be represented by a multi-dimensional vector [brown, small, Teddy dog].
- If more accurate retrieval is needed, we definitely need more dimensions of vectors, forming a space of more dimensions. In a multi-dimensional vector space, similarity retrieval becomes more complex. We need to use some algorithms, such as cosine similarity or Euclidean distance, to calculate the similarity between vectors. The vector database will help me achieve this.
- In Langchain4j, Embedding Store represents the vector database, which stores the vectors of words or phrases.
[Comparison table of all supported Embedding Stores](https://docs.langchain4j.dev/integrations/embedding-stores/)