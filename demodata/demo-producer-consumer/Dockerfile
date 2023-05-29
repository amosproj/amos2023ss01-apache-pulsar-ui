FROM --platform=linux/amd64 python:3.8

RUN mkdir /app
WORKDIR /app
COPY src/requirements.txt /app/

RUN pip install -r requirements.txt

COPY src/createCustomer.py /app/createCustomer.py
COPY src/models/* /app/models/

ENV PYTHONUNBUFFERED=true

ENTRYPOINT ["/usr/local/bin/python3", "/app/createCustomer.py"]
