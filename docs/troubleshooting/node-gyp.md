# Node-Gyp problems


See this when running npm install

    > fsevents@1.2.8 install /Users/watkinsav/workspace/voluntarily/vly/node_modules/fsevents
    > node install

    node-pre-gyp WARN Using request for node-pre-gyp https download 
    node-pre-gyp WARN Tried to download(404): https://fsevents-binaries.s3-us-west-2.amazonaws.com/v1.2.8/fse-v1.2.8-node-v72-darwin-x64.tar.gz 
    node-pre-gyp WARN Pre-built binaries not found for fsevents@1.2.8 and node@12.1.0 (node-v72 ABI, unknown) (falling back to source compile with node-gyp) 
      SOLINK_MODULE(target) Release/.node
      CXX(target) Release/obj.target/fse/fsevents.o
    ../fsevents.cc:43:32: error: no template named 'Handle' in namespace 'v8'
        static void Initialize(v8::Handle<v8::Object> exports);

fsevents is trying to download a pre-built binary from AWS S3. It doesn't find a matching version so decides to build from source code. 
This then throws up a bunch of compile problems.


## Who is asking for fsevents?
There are 4 references in package-lock
chokidar - "fsevents": "^1.2.7",

### fsevents NPM

Native access to MacOS FSEvents in Node.js

The FSEvents API in MacOS allows applications to register for notifications of changes to a given directory tree. It is a very fast and lightweight alternative to kqueue.

This is a low-level library. For a cross-platform file watching module that uses fsevents, check out Chokidar.

### Chokidar
A neat wrapper around node.js fs.watch / fs.watchFile / FSEvents https://paulmillr.com

### nodemon
Requires chokidar 
devDependencies
  "nodemon": "^1.18.11",

The package watches files to see if they have changed so that it can restart the server

### so can we avoid building it
Depends on the version of node
