FROM python:3.12-slim

WORKDIR /opt/app

RUN useradd --uid 10000 --create-home app && mkdir /opt/app/deps
COPY /deps/*.whl /opt/app/deps
COPY /dist/w3gallery_tdse1d-*.whl /opt/app

RUN pip3 install --no-cache-dir /opt/app/w3gallery_tdse1d-*.whl --find-links /opt/app/deps && \
    rm /opt/app/w3gallery_tdse1d-*.whl && rm /opt/app/deps/*.whl

USER 10000
EXPOSE 8080

ENTRYPOINT ["run_w3gallery_tdse1d"]
