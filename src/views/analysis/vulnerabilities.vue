<template>
  <div class="heading">
    <h2 class="heading-title">
      Vulnerabilities of Demo.py
    </h2>
    <div class="heading-subtitle text-medium-emphasis">
      List of vulnerabilities of the current submission.
    </div>
  </div>

  <v-row>
    <v-col cols="12" md="8">
      <!-- <v-card>
        <v-card-title>Binding a socket to all network interfaces</v-card-title>
        <v-card-subtitle>Binding a socket to all interfaces opens it up to traffic from any IPv4 address and is therefore associated with security risks</v-card-subtitle>
        <v-card-text>'0.0.0.0' binds a socket to all interfaces</v-card-text>
      </v-card> -->

      <v-alert
        density="compact"
        text="'0.0.0.0' binds a socket to all interfaces"
        title="Binding a socket to all network interfaces"
        type="error"
      ></v-alert>

      <v-card class="mt-4">
        <v-card-title>Code viewer</v-card-title>
        <v-card-subtitle class="pb-2">
          View the code of this submission.
        </v-card-subtitle>

        <my-submission-code class="submission-code" :content="content" language="python" />
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card
        title="Vulnerabilities"
      >
        <!-- <v-card-title>Vulnerabilities</v-card-title> -->

        <template v-slot:append>
          <v-select
            :items="['All', 'Warning', 'Error']"
          ></v-select>
        </template>

        <v-list density="compact">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            :color="item.type == 'warning' ? 'warning' : 'error'"
            lines="three"
            class="mb-2"
            :base-color="item.type == 'warning' ? 'orange-darken-4' : 'red-darken-4'"
            :title="item.text"
            :subtitle="item.subtitle"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.type == 'warning' ? 'mdi-alert' : 'mdi-alpha-x-circle'"></v-icon>
            </template>

            <!-- <v-list-item-title v-text="item.text"></v-list-item-title> -->
            <!-- <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle> -->
          </v-list-item>
        </v-list>

      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>

const items = [
        { text: 'Constant in conditional expression or statement', subtitle: 'The conditional is always true or always false', type: 'warning' },
        { text: 'Clear-text storage of sensitive information', subtitle: 'Sensitive information stored without encryption or hashing can expose it to an attacker', type: 'error' },
        { text: 'Binding a socket to all network interfaces', subtitle: 'Binding a socket to all interfaces opens it up to traffic from any IPv4 address and is therefore associated with security risks', type: 'error' },
        { text: 'Arbitrary file write during tarfile extraction', subtitle: 'Extracting files from a malicious tar archive without validating that the destination file path is within the destination directory can cause files outside the destination directory to be overwritten', type: 'error' },
      ]

const content =
`
# Example Python program with common vulnerabilities

import os
import tarfile
import re
from socket import *

from math import *

user_input = raw_input("Enter your name: ")  # For Python 2 compatibility

class OldStyleClass:
    def __init__(self):
        super(OldStyleClass, self).__init__()

    def some_method(self):
        assert (1, 2, 3) == (1, 2, 3), "Tuple assertion failed"

    def extract_tarfile(self, file_path):
        with tarfile.open(file_path, 'r') as tar:
            tar.extractall('/tmp/extracted_files')

    def search_regex(self, pattern, text):
        matches = re.findall(pattern, text)
        return matches

    def filter_html(self, html_content):
        clean_html = re.sub(r'<.*?>', '', html_content)
        return clean_html

server_socket = socket(AF_INET, SOCK_STREAM)
server_socket.bind(('0.0.0.0', 8080))

def process_request(request):
    if request.method == 'POST':
        # Process POST request without CSRF token validation
        pass

def log_sensitive_info(data):
    with open('/var/log/sensitive.log', 'a') as log_file:
        log_file.write(data + '\n')

def store_sensitive_info(username, password):
    with open('/tmp/credentials.txt', 'w') as creds_file:
        creds_file.write(f'Username: {username}, Password: {password}')

def execute_command(command):
    os.system(command)

if 10 == 10:
    print("Constants are equal")

a = [1, 2, 3]
b = a
if a is b:
    print("a and b are identical")

# Sample usage
obj = OldStyleClass()
obj.some_method()
obj.extract_tarfile('/path/to/some/archive.tar')
obj.search_regex(r'\b(\w+)\b', 'Hello world')
obj.filter_html('<p>Hello, <b>world</b>!</p>')
`
</script>

<style lang="scss" scoped>
.info {
  &-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}

.submission {
  &-code {
    height: 500px;
  }

  &-graph {
    height: 350px;
  }
}

.item-warning {
  background-color: rgb(255, 221, 0, 0.3);
  color: #F9A825;
}

.item-error {
  background-color: rgb(255, 49, 49);
  color: white;
}
</style>
