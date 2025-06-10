FROM node:latest

RUN apt-get update && apt-get -y install \
    vim \
    postgresql \
    postgresql-contrib \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY project/ /home/node/project/

USER node
