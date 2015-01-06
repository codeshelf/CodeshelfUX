./build.sh
mkdir -p target
tar zcvf target/CodeshelfWebApp.tar.gz --exclude=./node_modules --exclude=./.git .
