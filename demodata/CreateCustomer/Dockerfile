FROM artifacts.rbi.tech/docker/raiffeisen/cortex-pipeline-application/python:2021.46.11

RUN mkdir /app
WORKDIR /app
COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY createCustomer.py /app/createCustomer.py
COPY models/* /app/models/

ENTRYPOINT ["/usr/local/bin/python3", "/app/createCustomer.py"]
