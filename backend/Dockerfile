FROM gradle:8.10-jdk17-alpine AS build

WORKDIR /app

COPY . .

RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dnetworkaddress.cache.negative.ttl=0", "-Dnetworkaddress.cache.ttl=30", "-jar", "app.jar"]

