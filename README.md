
# 💫 Re-Grass | Grass Stage 2 Mining with Proxies

### Prerequisites

To get started, make sure you have Git, Node.js, and Yarn installed. Follow these steps to set up everything from scratch.

---

### 1. Install Git

1. **For Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install git -y
   ```

2. **For macOS:**
   ```bash
   brew install git
   ```

3. **For Windows:**
   Download and install Git from [git-scm.com](https://git-scm.com/download/win).

---

### 2. Install Node.js via NVM

Using `nvm` (Node Version Manager) makes it easy to manage Node.js versions.

1. **Install NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```
   
   Then, load `nvm` (you may need to close and reopen the terminal):
   ```bash
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
   ```

2. **Install Node.js:**
   ```bash
   nvm install node
   ```

   Verify Node.js installation:
   ```bash
   node -v
   ```

---

### 3. Install Yarn

With Node.js installed, use `npm` to install Yarn globally:

```bash
npm install -g yarn
```

---

### 4. Clone the Re-Grass Repository

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dxrry/Re-Grass.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Re-Grass
   ```

---

### 5. Install Dependencies

Install the required dependencies with Yarn:

```bash
yarn install
```

---

### 6. Configure `src/Main.ts`

1. Open `src/Main.ts` in a text editor.

2. Locate the following line:
   ```typescript
   const UID: string = "2XXXXXXXXXXXXXXXXXXXXXXXXXX";
   ```

3. Replace `"2XXXXXXXXXXXXXXXXXXXXXXXXXX"` with your UID:
   ```typescript
   const UID: string = "your-unique-uid";
   ```

---

### 7. Set Up Proxies

1. Create or edit the `proxy.txt` file in the project directory.

2. Add your proxies in the following format, with each proxy on a new line:
   ```
   scheme://user:password@ip:port
   ```

   Example:
   ```
   http://username:password@192.168.1.100:8080
   ```

---

### 8. Run the Project

Run the project with the following command:

```bash
yarn main
```