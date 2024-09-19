const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        const filePath = path.join(__dirname, '../client/build', 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.statusCode = 500;
                res.end('Server Error');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
        });
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
};
