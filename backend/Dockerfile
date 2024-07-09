# Step 1: Build the Spring Boot application
FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run the application
FROM openjdk:17-jdk
ARG PROFILE=dev
ARG APP_VERSION=1.0.0

WORKDIR /app
COPY --from=builder /build/target/trailbuddy-backend-*.jar /app/app.jar

EXPOSE 8080

ENV DB_URL=jdbc:postgresql://postgres-sql-trailbuddy:5432/${DB_NAME:-trailbuddy_db}
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

CMD ["sh", "-c", "java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} app.jar"]