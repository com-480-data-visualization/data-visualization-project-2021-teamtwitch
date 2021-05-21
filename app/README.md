# Running the app

## Setup

* Install [node.js 14](https://nodejs.org/en/download/package-manager/)  and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
* Run `yarn` in this directory to install the required dependencies

```bash
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install --global yarn

cd $(git rev-parse --show-toplevel) && cd app
yarn
```

## Local development

You need two terminal sessions to run the app.

* Run `yarn d`
* Run `PORT=<your port number> node serve.js`

```bash
# Terminal 1
cd $(git rev-parse --show-toplevel) && cd app
yarn d

# Terminal 2, assuming port 8080
cd $(git rev-parse --show-toplevel) && cd app
PORT=8080 node serve.js
```

* Navigate in a web browser to `http://localhost:<port number>` to see the results
* Refresh the page when changes are made to see the updates

Feeling the indentation is ugly or there are too many messy lines? Run `yarn lint` regularly and it will prettify the code for you.
