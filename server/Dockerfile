# Stage 1: Build the Spring Boot application
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Pre-fetch dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the Spring Boot application
FROM openjdk:21-slim

WORKDIR /app

# Create a non-root user
RUN addgroup --system spring && adduser --system --group spring
USER spring

# Copy built jar with proper ownership
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
