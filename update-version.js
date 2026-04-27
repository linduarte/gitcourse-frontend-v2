import fs from "fs";
import path from "path";

const VERSION = Date.now(); // 🔥 timestamp automático
const ROOT = "docs";

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    // Atualiza já versionados
    content = content.replace(
        /git-course-functions\.js\?v=\d+/g,
        `git-course-functions.js?v=${VERSION}`
    );

    // Adiciona versão onde não existe
    content = content.replace(
        /git-course-functions\.js(?!\?v=)/g,
        `git-course-functions.js?v=${VERSION}`
    );

    fs.writeFileSync(filePath, content);
    console.log("✔", filePath);
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith(".html") || file.endsWith(".js")) {
            updateFile(fullPath);
        }
    });
}

console.log(`🚀 Nova versão: ${VERSION}`);
walk(ROOT);
console.log("✅ Versionamento aplicado!");