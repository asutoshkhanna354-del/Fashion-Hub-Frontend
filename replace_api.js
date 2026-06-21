const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');
const searchPattern = /const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| (process\.env\.NEXT_PUBLIC_API_URL \|\| )?["']http:\/\/(localhost|127\.0\.0\.1):3001["'];/g;
const replacePattern = 'const API_URL = "https://fashion-hub-backend-13eb.onrender.com";';

const searchPattern2 = /\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/(localhost|127\.0\.0\.1):3001"\}/g;
const replacePattern2 = '${"https://fashion-hub-backend-13eb.onrender.com"}';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(directoryPath, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        if (searchPattern.test(content)) {
            content = content.replace(searchPattern, replacePattern);
            updated = true;
        }
        
        if (searchPattern2.test(content)) {
            content = content.replace(searchPattern2, replacePattern2);
            updated = true;
        }
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
