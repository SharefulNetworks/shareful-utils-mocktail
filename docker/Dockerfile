FROM ubuntu:22.04

WORKDIR /

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        bash \
        jq \
        socat \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY . /

RUN chmod +x /mocktail

EXPOSE 3333

CMD ["./mocktail"]
