FROM mcr.microsoft.com/playwright:v1.34.3-jammy

COPY . /rfslic_tests

WORKDIR /rfslic_tests

RUN npm ci

RUN npx playwright install --with-deps