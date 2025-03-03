FROM openjdk:17

WORKDIR /app

# Copy the backend Java file into the container
COPY BackendMain.java .

# Compile the Java application
RUN javac BackendMain.java

# Expose the port for frontend-backend communication
EXPOSE 5000

# Run the compiled Java application
CMD ["java", "BackendMain"]