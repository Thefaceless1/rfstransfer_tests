FROM mcr.microsoft.com/playwright:v1.49.0-jammy

COPY . /rfstransfer_tests

WORKDIR /rfstransfer_tests

RUN npm ci

RUN npx playwright install --with-deps