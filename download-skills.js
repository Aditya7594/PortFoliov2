const https = require('https');
const fs = require('fs');
const path = require('path');

const skills = [
  { name: 'android', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/android.png' },
  { name: 'cpp', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/cpp.png' },
  { name: 'css', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/css.png' },
  { name: 'firebase', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/firebase.png' },
  { name: 'git', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/git.png' },
  { name: 'html', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/html.png' },
  { name: 'java', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/java.png' },
  { name: 'javascript', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/javascript.png' },
  { name: 'kotlin', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/kotlin.png' },
  { name: 'python', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/python.png' },
  { name: 'react', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/react.png' },
  { name: 'sql', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/sql.png' },
  { name: 'visual-studio', url: 'https://raw.githubusercontent.com/MA-Ahmad/portfolio/master/src/assets/images/skills/visual-studio.png' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Error downloading ${url}: ${err.message}`);
    });
  });
};

const downloadAllImages = async () => {
  for (const skill of skills) {
    const dir = path.join('public', 'icons', 'src', skill.name);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filepath = path.join(dir, `${skill.name}.png`);
    try {
      await downloadImage(skill.url, filepath);
    } catch (error) {
      console.error(error);
    }
  }
};

downloadAllImages().then(() => {
  console.log('All downloads completed!');
}).catch(error => {
  console.error('Error downloading images:', error);
}); 