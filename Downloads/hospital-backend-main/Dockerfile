# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
# Cache deps to speed up rebuilds
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests clean install package

# ---------- Run stage ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# copy wait script and install netcat for TCP checks
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh && \
	apk add --no-cache netcat-openbsd

ENV JAVA_OPTS=""
EXPOSE 8081
# Wait for DB then start the app
ENTRYPOINT ["/usr/local/bin/wait-for-db.sh","sh","-c","java $JAVA_OPTS -jar app.jar"]
