# Stage 1: Build the Spring Boot application
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
COPY src ./src

RUN ./mvnw clean package -DskipTests

# Stage 2: Run the Spring Boot application
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
