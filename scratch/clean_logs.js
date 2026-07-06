const fs = require('fs');

const filesToClean = [
    'src/middleware.ts',
    'src/lib/supabase.ts',
    'src/lib/db.ts',
    'src/lib/mail.ts',
    'src/app/api/quiz/submit/route.ts',
    'src/app/api/payment/verify/route.ts',
    'src/app/api/debug-admin/route.ts'
];

filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        let newContent = content.replace(/^(.*console\.log\([^;]+;?\s*)$/gm, '// $1');
        
        // Also handle multiline console.logs (if any) or just run it multiple times if needed.
        // Actually, just replacing console.log with // console.log works for single lines.
        newContent = content.replace(/(\s*)(console\.log\()/g, '$1// $2');
        
        if (content !== newContent) {
            fs.writeFileSync(file, newContent);
            console.log(`Cleaned ${file}`);
        }
    }
});
console.log("Done");
