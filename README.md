# NodeJS ExpressJS 

# Important command

npm init <br />
npm i --save express express-session body-parser ejs mongodb  <br />
npm i --save-dev nodemon <br />
nodemon app.js <br />


# Ejs Template Engine 

<%= %> <br />

** lambda_01 : AWS Lambda working fine
rm -rf node_modules package-lock.json
rm package-lock.json && rm -rf node_modules && npm install && npm install --package-lock-only && git add package-lock.json && git commit -m "Fix: update lockfile to match package.json" && git push


npm install serverless@3.40.0 serverless-offline@12.0.4 --save-dev
npm install --legacy-peer-deps
npx serverless deploy
npx serverless offline
npx serverless deploy
npx serverless info
npx serverless remove
npx serverless deploy --stage prod
