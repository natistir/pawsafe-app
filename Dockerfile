# Dockerfile for React Native Development Environment
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    unzip \
    wget \
    git \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

# Create Android SDK directory
RUN mkdir -p $ANDROID_HOME

# Download and install Android command line tools
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d $ANDROID_HOME/ && \
    mkdir -p $ANDROID_HOME/cmdline-tools/latest && \
    mv $ANDROID_HOME/cmdline-tools/bin $ANDROID_HOME/cmdline-tools/lib $ANDROID_HOME/cmdline-tools/NOTICE.txt $ANDROID_HOME/cmdline-tools/source.properties $ANDROID_HOME/cmdline-tools/latest/ && \
    rm /tmp/cmdline-tools.zip

# Update PATH for cmdline-tools
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Install React Native CLI and Expo CLI
RUN npm install -g @react-native-community/cli @expo/cli

# Set working directory
WORKDIR /app

# Expose ports for development servers
EXPOSE 8081 19000 19001 19002

# Default command
CMD ["bash"]