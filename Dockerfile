FROM openjdk:17

WORKDIR /app

# Copy Java files into the container
COPY BackendMain.java .

# Install Spark Java (needed for HTTP support)
RUN javac -cp ".:spark-core-2.9.3.jar" BackendMain.java

# Expose HTTP port
EXPOSE 5000

# Run Backend
CMD ["java", "-cp", ".:spark-core-2.9.3.jar", "BackendMain"]