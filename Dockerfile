FROM ubuntu:16.04

LABEL maintainer="Manraj Singh Grover <manrajsinghgrover@gmail.com>"

# Install basic CLI tools etc.
RUN apt-get update && apt-get install -y --fix-missing --no-install-recommends \
    build-essential \
    curl \
    git-core \
    iputils-ping \
    pkg-config \
    rsync \
    software-properties-common \
    unzip \
    wget \
    net-tools

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs

# Install yarn
RUN npm install -g yarn

# Install tfjs-node
RUN yarn add @tensorflow/tfjs
RUN yarn add @tensorflow/tfjs-node

# Clean up commands
RUN apt-get autoremove -y && apt-get clean && \
    rm -rf /usr/local/src/*

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
RUN mkdir -p /app
WORKDIR /app
copy .  /app

# COPY ./package.json /app/package.json
RUN npm install pm2 -g
RUN npm install
ENV NODE_ENV=pro
EXPOSE 8000
CMD ["/bin/bash"]

# docker build -t limweb/app .
# docker run -it -p 3000:3000 --name webapi --link mongodb limweb/app
# docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf