FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY mytube/pom.xml .
RUN mvn dependency:go-offline

COPY mytube/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]