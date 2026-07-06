const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src/app/api');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace import
    let newContent = content.replace(/import\s+\{\s*getServerSession\s*\}\s+from\s+['"]@\/lib\/auth['"];?/g, 
        'import { getServerSession } from "next-auth/next";\nimport { authOptions } from "@/app/api/auth/[...nextauth]/route";');
        
    // Replace calls
    newContent = newContent.replace(/await\s+getServerSession\(\)/g, 'await getServerSession(authOptions)');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
    }
});
console.log("Done");
