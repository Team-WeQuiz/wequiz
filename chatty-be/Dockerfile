FROM bellsoft/liberica-openjdk-debian:21 AS builder
ENV WORK /workspace
COPY build.gradle settings.gradle gradlew $WORK/
COPY gradle $WORK/gradle
COPY ./src $WORK/src

WORKDIR $WORK

RUN apt-get update && apt-get install -y dos2unix unzip curl

RUN dos2unix gradlew && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

RUN chmod +x gradlew
RUN ./gradlew clean bootJar --parallel --no-daemon

FROM bellsoft/liberica-openjdk-debian:21

ARG JAR_FILE=workspace/build/libs/*.jar
COPY --from=builder $JAR_FILE app.jar

ENTRYPOINT ["java", \
            "-Xms1400m", \
            "-Xmx1400m", \
            "-jar", \
            "-Dspring.profiles.active=prod", \
            "/app.jar"]
