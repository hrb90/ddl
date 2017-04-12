git checkout gh-pages
cd data
ruby ./scrape.rb
ruby ./jsonify.rb
cd ..
npm install
webpack
git add data/ bundle.js
git commit -m "Updating data"
git push origin gh-pages
