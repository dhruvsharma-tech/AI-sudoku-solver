# Java Service Dockerfile
FROM maven:3.9.5-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
# Dependencies download karo (layer caching ke liye)
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# ─── Runtime Stage ───
FROM eclipse-temurin:21-jre-slim

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
