# SPDX-License-Identifier: MIT
# SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
# SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
# SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>

# Use node runtime as image
FROM node:14-alpine

# Set the working directory to /app and ENV variable for backend url
WORKDIR /app
ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=$BACKEND_URL

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
