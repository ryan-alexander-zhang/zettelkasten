---
tags:
  - how-to
  - maven
  - archetype
id: 20251227102427
created: 2025-12-27 10:24:27
status:
  - done
type: how-to-note
aliases:
  - use-the-maven-archetype-to-generate-a-scaffold
---

## Create the Archetype Mannually[^1]

### Step1: Create a new project and pom.xml for the archetype artifact

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>my.groupId</groupId>
  <artifactId>my-archetype-id</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>maven-archetype</packaging>
  <build>
    <extensions>
      <extension>
        <groupId>org.apache.maven.archetype</groupId>
        <artifactId>archetype-packaging</artifactId>
        <version>3.4.1</version>
      </extension>
    </extensions>
  </build>
</project>
```

### Step2: Create the archetype descriptor[^2]

```sh
archetype
|-- pom.xml
`-- src
    `-- main
        `-- resources
            |-- META-INF
            |   `-- maven
            |       `--archetype-metadata.xml
            `-- archetype-resources
                |-- pom.xml
                `-- src
                    |-- main
                    |   `-- java
                    |       `-- App.java
                    `-- test
                        `-- java
                            `-- AppTest.java
```

The most important part is `archetype-metadata.xml` file. Here's an example from the official demo.

```xml
<archetype-descriptor
        xmlns="http://maven.apache.org/plugins/maven-archetype-plugin/archetype-descriptor/1.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/plugins/maven-archetype-plugin/archetype-descriptor/1.2.0 https://maven.apache.org/xsd/archetype-descriptor-1.2.0.xsd"
        name="quickstart">
    <fileSets>
        <fileSet filtered="true" packaged="true">
            <directory>src/main/java</directory>
        </fileSet>
        <fileSet>
            <directory>src/test/java</directory>
        </fileSet>
    </fileSets>
</archetype-descriptor>
```
## Use the Maven Archetype to Generate the Scaffold from Current Project[^3]

```sh
mvn archetype:create-from-project
```

## Use the Archetype to Create a Project

```sh
mvn archetype:generate \  
  -DarchetypeGroupId=com.ryan.ddd \  
  -DarchetypeArtifactId=ddd-layout-template-archetype \  
  -DarchetypeVersion=0.0.1-SNAPSHOT \  
  -DgroupId=com.example.ddd \  
  -DartifactId=demo-ddd \  
  -Dversion=0.0.1-SNAPSHOT \  
  -Dpackage=com.example.ddd \  
  -DinteractiveMode=false
```

## Maven Archetype Demo [^4]

A DDD scaffold Maven archetype demo.
# References

[^1]: [Guide to Creating Archetypes – Maven](https://maven.apache.org/guides/mini/guide-creating-archetypes.html)
[^2]: [ArchetypeDescriptor – Maven Archetype Descriptor Model](https://maven.apache.org/archetype/archetype-models/archetype-descriptor/archetype-descriptor.html)
[^3]: [archetype:create-from-project – Maven Archetype Plugin](https://maven.apache.org/archetype/maven-archetype-plugin/create-from-project-mojo.html)
[^4]: [GitHub - ryan-alexander-zhang/ddd-layout-template](https://github.com/ryan-alexander-zhang/ddd-layout-template)