FROM python:3.8

RUN mkdir /app
WORKDIR /app
COPY src/requirements.txt /app/

RUN pip install -r requirements.txt

COPY src/createCustomer.py /app/createCustomer.py
COPY src/models/* /app/models/
COPY setup-demodata.sh /app/setup-demodata.sh

ENTRYPOINT ["/usr/local/bin/python3", "/app/createCustomer.py"]
