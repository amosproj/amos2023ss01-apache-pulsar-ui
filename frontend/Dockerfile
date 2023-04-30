# SPDX-License-Identifier: MIT
# SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
# SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

# Use node runtime as image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install app dependencies, without generating a yarn.lock file. Fails if an update is needed.
RUN yarn install --frozen-lockfile

# Copy the rest of the app files to the container
COPY . .

# Build the app
RUN yarn build

# Expose port 3000 for the app to listen on
EXPOSE 8082

# Start the app
CMD ["yarn", "start"]