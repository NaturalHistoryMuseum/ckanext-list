FROM naturalhistorymuseum/ckantest:latest

WORKDIR /base/src/ckanext-list

# copy over the source
COPY . .

# install the base + test dependencies
RUN pip install -e .[test]

# this entrypoint ensures our service dependencies (postgresql, solr and redis) are running before
# running the cmd
ENTRYPOINT ["/bin/bash", "/opt/waits/basic.sh"]

# run the tests with coverage output
CMD ["bash", "/opt/scripts/run-tests.sh", "ckanext.list"]
