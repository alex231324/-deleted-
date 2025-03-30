import { additionalSkillsText, githubApiEndpoint } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const previewContent = document.getElementById('previewContent');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const githubTokenInput = document.getElementById('githubToken');
    const githubStatus = document.getElementById('githubStatus');
    const showPowershellCmd = document.getElementById('showPowershellCmd');
    const powershellCommand = document.getElementById('powershellCommand');
    const copyPowershellCmd = document.getElementById('copyPowershellCmd');
    const loginBtn = document.getElementById('loginBtn');
    const loginStatus = document.getElementById('loginStatus');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // PowerShell command toggle
    showPowershellCmd.addEventListener('click', () => {
        powershellCommand.classList.toggle('show');
    });
    
    // Copy PowerShell command
    copyPowershellCmd.addEventListener('click', () => {
        const commandText = powershellCommand.querySelector('pre').textContent;
        navigator.clipboard.writeText(commandText)
            .then(() => {
                showNotification('PowerShell command copied to clipboard!');
                copyPowershellCmd.textContent = 'Copied!';
                setTimeout(() => {
                    copyPowershellCmd.textContent = 'Copy Command';
                }, 2000);
            })
            .catch(err => {
                console.error('Error copying PowerShell command: ', err);
                showNotification('Failed to copy PowerShell command.', true);
            });
    });
    
    // Add login functionality
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('loginUsername').value.trim();
        
        if (!username) {
            loginStatus.textContent = "Please enter a username";
            loginStatus.style.color = "red";
            return;
        }
        
        loginStatus.textContent = "Logging in...";
        loginBtn.disabled = true;
        
        try {
            // Fetch user data from GitHub API
            const response = await fetch(`${githubApiEndpoint}/users/${username}`);
            
            if (response.ok) {
                const userData = await response.json();
                
                // Prefill the form with user data
                document.getElementById('githubUsername').value = userData.login;
                document.getElementById('description').value = userData.bio || "";
                
                loginStatus.textContent = `Logged in as ${userData.login}`;
                loginStatus.style.color = "green";
                showNotification(`Successfully logged in as ${userData.login}`);
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error('Login error:', error);
            loginStatus.textContent = `Error: ${error.message}`;
            loginStatus.style.color = "red";
            showNotification("Login failed. Check username and try again.", true);
        } finally {
            loginBtn.disabled = false;
        }
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateProfile();
    });
    
    copyBtn.addEventListener('click', () => {
        copyToClipboard();
    });
    
    saveBtn.addEventListener('click', () => {
        saveToGitHub();
    });
    
    function generateProfile() {
        const githubUsername = document.getElementById('githubUsername').value.trim();
        const description = document.getElementById('description').value.trim();
        
        // Get selected skills
        const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
            .map(checkbox => checkbox.value);
        
        if (!githubUsername || !description) {
            alert('Please fill in all required fields');
            return;
        }
        
        const profileMarkdown = createProfileMarkdown(githubUsername, description, selectedSkills);
        displayPreview(profileMarkdown);
        
        // Show notification
        showNotification(`Profile for ${githubUsername} generated successfully!`);
    }
    
    function createProfileMarkdown(username, description, skills) {
        // Header with name and link
        let markdown = `# Hi there, I'm [${username}](https://github.com/${username}) 👋\n\n`;
        
        // About me section
        markdown += `## About Me\n${description}\n\n`;
        
        // Skills section
        if (skills.length > 0) {
            markdown += `## Skills and Technologies\n\n`;
            
            const skillsImages = skills.map(skill => {
                const skillLower = skill.toLowerCase();
                let imgSrc;
                
                switch(skillLower) {
                    case 'c++':
                        imgSrc = "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg";
                        break;
                    case 'c':
                        imgSrc = "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg";
                        break;
                    case 'java':
                        imgSrc = "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg";
                        break;
                    case 'python':
                        imgSrc = "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg";
                        break;
                    case 'c#':
                        imgSrc = "https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg";
                        break;
                    default:
                        imgSrc = "";
                }
                
                return `<img align="left" alt="${skill}" width="30px" style="padding-right:10px;" src="${imgSrc}" />`;
            }).join('\n');
            
            markdown += skillsImages + '\n\n';
            
            // Add additional skills text from config if provided
            if (additionalSkillsText) {
                markdown += `\n\n${additionalSkillsText}\n\n`;
            }
        }
        
        // GitHub stats section
        markdown += `## GitHub Stats\n\n`;
        markdown += `![${username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical)\n\n`;
        
        // Top languages
        markdown += `[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=radical)](https://github.com/${username})\n\n`;
        
        // CSS section with more 2011 styling
        markdown += `## My CSS Style\n\n`;
        markdown += "```css\n";
        markdown += `/* Web 2.0 Styles - Best viewed in IE7+ or Firefox 3.6 */\n`;
        markdown += `.profile-container {\n`;
        markdown += `  display: flex;\n`;
        markdown += `  flex-direction: column;\n`;
        markdown += `  align-items: center;\n`;
        markdown += `  background: linear-gradient(to bottom, #ffffff, #e6e6e6);\n`;
        markdown += `  border-radius: 10px;\n`;
        markdown += `  padding: 20px;\n`;
        markdown += `  box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,1);\n`;
        markdown += `  border: 1px solid #ccc;\n`;
        markdown += `}\n\n`;
        markdown += `.profile-header {\n`;
        markdown += `  color: #333;\n`;
        markdown += `  font-size: 24px;\n`;
        markdown += `  margin-bottom: 15px;\n`;
        markdown += `  text-shadow: 1px 1px 0 white;\n`;
        markdown += `  font-family: "Trebuchet MS", Arial, sans-serif;\n`;
        markdown += `}\n\n`;
        markdown += `.web20-button {\n`;
        markdown += `  background: linear-gradient(to bottom, #f9f9f9, #e3e3e3);\n`;
        markdown += `  border: 1px solid #999;\n`;
        markdown += `  border-radius: 3px;\n`;
        markdown += `  color: #333;\n`;
        markdown += `  padding: 5px 10px;\n`;
        markdown += `  font-weight: bold;\n`;
        markdown += `  box-shadow: 0 1px 2px rgba(0,0,0,0.2);\n`;
        markdown += `}\n`;
        markdown += "```\n\n";
        
        // JS section with more 2011 touches
        markdown += `## My JavaScript Code\n\n`;
        markdown += "```javascript\n";
        markdown += `// GitHub Profile Visitor Counter - Compatible with IE6+\n`;
        markdown += `function countVisitor() {\n`;
        markdown += `  console.log("Welcome to my GitHub profile!");\n`;
        markdown += `  const visitCount = localStorage.getItem("visits") || 0;\n`;
        markdown += `  localStorage.setItem("visits", Number(visitCount) + 1);\n`;
        markdown += `  return Number(visitCount) + 1;\n`;
        markdown += `}\n\n`;
        markdown += `// Display a greeting based on time of day\n`;
        markdown += `function displayGreeting() {\n`;
        markdown += `  const hour = new Date().getHours();\n`;
        markdown += `  let greeting = "";\n\n`;
        markdown += `  if (hour < 12) greeting = "Good morning";\n`;
        markdown += `  else if (hour < 18) greeting = "Good afternoon";\n`;
        markdown += `  else greeting = "Good evening";\n\n`;
        markdown += `  return \`\${greeting}, thanks for visiting!\`;\n`;
        markdown += `}\n\n`;
        markdown += `// Web 2.0 badge creator\n`;
        markdown += `function createBadge(text) {\n`;
        markdown += `  const badge = document.createElement("div");\n`;
        markdown += `  badge.innerHTML = text;\n`;
        markdown += `  badge.style.background = "linear-gradient(to bottom, #f9f9f9, #e3e3e3)";\n`;
        markdown += `  badge.style.border = "1px solid #999";\n`;
        markdown += `  badge.style.borderRadius = "3px";\n`;
        markdown += `  badge.style.padding = "3px 8px";\n`;
        markdown += `  badge.style.display = "inline-block";\n`;
        markdown += `  badge.style.fontSize = "11px";\n`;
        markdown += `  badge.style.fontFamily = "Verdana";\n`;
        markdown += `  badge.style.color = "#333";\n`;
        markdown += `  badge.style.textShadow = "0 1px 0 white";\n`;
        markdown += `  document.body.appendChild(badge);\n`;
        markdown += `}\n`;
        markdown += "```\n\n";
        
        // Footer with more 2011 era elements
        markdown += `---\n\n`;
        markdown += `<div align="center">\n`;
        markdown += `<img src="https://img.shields.io/badge/MADE%20WITH-WEB%202.0-orange?style=for-the-badge" />\n`;
        markdown += `<img src="https://img.shields.io/badge/BEST%20VIEWED%20WITH-FIREFOX-blue?style=for-the-badge" />\n`;
        markdown += `<img src="https://img.shields.io/badge/HOSTED%20ON-GITHUB-success?style=for-the-badge" />\n`;
        markdown += `</div>\n\n`;
        markdown += `Feel free to connect with me and explore my repositories! Last updated on ${new Date().toLocaleDateString()}`;
        
        return markdown;
    }
    
    function displayPreview(markdown) {
        // Convert markdown to HTML
        const html = convertMarkdownToHTML(markdown);
        previewContent.innerHTML = html;
    }

    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Convert headers
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        
        // Convert links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Convert line breaks
        html = html.replace(/\n/g, '<br>');
        
        // Handle images (GitHub stats)
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">');
        
        return html;
    }

    function copyToClipboard() {
        const previewCode = document.querySelector('.preview-content');
        if (!previewCode || previewCode.innerHTML === '<p class="preview-placeholder">Your generated profile will appear here...</p>') {
            alert('Generate a profile first!');
            return;
        }
        
        // Convert HTML back to markdown for copying
        let markdownText = previewContent.innerHTML
            .replace(/<h1>(.*?)<\/h1>/g, '# $1')
            .replace(/<h2>(.*?)<\/h2>/g, '## $1')
            .replace(/<a href="(.*?)" target="_blank">(.*?)<\/a>/g, '[$2]($1)')
            .replace(/<br>/g, '\n')
            .replace(/<img src="(.*?)" alt="(.*?)" style="max-width:100%;">/g, '![$2]($1)');
        
        navigator.clipboard.writeText(markdownText)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copy-success');
                
                // Show notification
                showNotification('Profile copied to clipboard!');
                
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                    copyBtn.classList.remove('copy-success');
                }, 2000);
            })
            .catch(err => {
                console.error('Error copying text: ', err);
                alert('Failed to copy to clipboard.');
            });
    }
    
    async function saveToGitHub() {
        const previewCode = document.querySelector('.preview-content code');
        if (!previewCode || previewCode.textContent === '') {
            alert('Generate a profile first!');
            return;
        }
        
        const username = document.getElementById('githubUsername').value.trim();
        const token = githubTokenInput.value.trim();
        
        if (!token) {
            alert('Please enter your GitHub personal access token');
            return;
        }
        
        saveBtn.innerHTML = '<span class="loading"></span> Saving...';
        saveBtn.disabled = true;
        githubStatus.textContent = "Saving to GitHub...";
        
        try {
            // Get the unescaped text content
            const content = previewContent.innerHTML.replace(/<br>/g, '\n');
            
            // Check if README already exists
            let sha = null;
            try {
                const checkResp = await fetch(`${githubApiEndpoint}/repos/${username}/${username}/contents/README.md`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (checkResp.ok) {
                    const data = await checkResp.json();
                    sha = data.sha;
                }
            } catch (error) {
                console.log('README does not exist yet, creating new one');
            }
            
            // Create or update README
            const response = await fetch(`${githubApiEndpoint}/repos/${username}/${username}/contents/README.md`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update profile README.md',
                    content: btoa(unescape(encodeURIComponent(content))),
                    sha: sha
                })
            });
            
            if (response.ok) {
                githubStatus.textContent = "Successfully saved to GitHub!";
                githubStatus.style.color = "green";
                showNotification('Profile successfully saved to GitHub!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save README');
            }
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            githubStatus.textContent = `Error: ${error.message}`;
            githubStatus.style.color = "red";
            showNotification(`Error: ${error.message}`, true);
        } finally {
            saveBtn.innerHTML = 'Save to GitHub';
            saveBtn.disabled = false;
        }
    }
    
    // Function to show notification
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.style.display = 'block';
        
        if (isError) {
            notification.style.background = 'linear-gradient(to bottom, #ff5e62, #ff0000)';
            notification.style.borderColor = '#cc0000';
        } else {
            notification.style.background = 'linear-gradient(to bottom, #66cc99, #339966)';
            notification.style.borderColor = '#228855';
        }
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.style.display = 'none';
                notification.classList.remove('fade-out');
            }, 500);
        }, 3000);
    }
});