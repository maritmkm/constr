import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\cec53f37-76e3-4a89-852c-526b4f497567';
const targetDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);
files.forEach(file => {
  if (file.endsWith('.jpg')) {
    let destName = file;
    if (file.startsWith('hero_architecture')) destName = 'hero_architecture.jpg';
    else if (file.startsWith('project_dune_residence')) destName = 'project_dune_residence.jpg';
    else if (file.startsWith('project_coastal_sanctuary')) destName = 'project_coastal_sanctuary.jpg';
    else if (file.startsWith('project_commercial_hq')) destName = 'project_commercial_hq.jpg';
    else if (file.startsWith('project_interior_penthouse')) destName = 'project_interior_penthouse.jpg';
    
    fs.copyFileSync(path.join(brainDir, file), path.join(targetDir, destName));
    console.log(`Copied ${file} -> ${destName}`);
  }
});
