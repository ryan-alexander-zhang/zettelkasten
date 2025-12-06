---
tags:
id: 20251205165330
created: 2025-12-05
reviewed: false
status:
  - pending
  - done
  - in_progress
type: fleet-note
---

Config path filter:

```java
@Configuration  
public class SaTokenConfig implements WebMvcConfigurer {  
  
  @Override  
  public void addInterceptors(InterceptorRegistry registry) {  
    registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))  
        .addPathPatterns("/apis/app/v1/**")  
        .excludePathPatterns("/healthz")  
        .excludePathPatterns("/apis/app/v1/tenants/login");  
  }  
}
```


Config permission:

```java
@Component  
public class SaTokenPermissionConfig implements StpInterface {  
  
  @Autowired  
  private TenantDatabaseGateway tenantDatabaseGateway;  
  
  @Override  
  public List<String> getPermissionList(Object loginId, String loginType) {  
    return List.of();  
  }  
  
  @Override  
  public List<String> getRoleList(Object loginId, String loginType) {  
    Tenant tenant = tenantDatabaseGateway.get(String.valueOf(loginId));  
    return tenant.getRoles().stream()  
        .map(Role::getName)  
        .filter(StringUtils::hasLength)  
        .toList();  
  }  
}
```

# References

# Link to