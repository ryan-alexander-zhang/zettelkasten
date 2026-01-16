---
tags:
  - openapi
  - swagger
id: 20251121094330
created: 2025-11-21
reviewed: false
status:
  - done
type: fleet-note
---

## **How to generate the client code from the api yaml?**

Example: [harbor/api/v2.0 at main · goharbor/harbor](https://github.com/goharbor/harbor/tree/main/api/v2.0)

Install:
```shell
brew install openapi-generator
```

Generate command:

```shell
openapi-generator generate \
  -i https://raw.githubusercontent.com/goharbor/harbor/refs/heads/main/api/v2.0/swagger.yaml \
  -g java \
  --library restclient \
  -o ./harbor-client \
  --group-id com.ryan.openapi.harbor \
  --artifact-id harbor-client \
  --artifact-version 1.0.0 \
  --api-package com.ryan.openapi.harbor.client.api \
  --model-package com.ryan.openapi.harbor.client.model \
  --invoker-package com.ryan.openapi.harbor.client.invoker \
  --additional-properties=useMaven=true,dateLibrary=java21,hideGenerationTimestamp=true,generateBuilders=true,licenseName=MIT,licenseUrl=https://opensource.org/license/mit
```


# References
* [GitHub - OpenAPITools/openapi-generator: OpenAPI Generator allows generation of API client libraries (SDK generation), server stubs, documentation and configuration automatically given an OpenAPI Spec (v2, v3)](https://github.com/OpenAPITools/openapi-generator)
* [Generators List \| OpenAPI Generator](https://openapi-generator.tech/docs/generators)
# Link to