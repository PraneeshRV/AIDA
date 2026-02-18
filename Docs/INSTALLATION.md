# AIDA Installation Guide

Get AIDA running in 5 minutes.

---

## Prerequisites

Before we start, make sure you have:

| Requirement | Version | Check |
|-------------|---------|-------|
| **Docker Desktop** | Latest | `docker --version` |
| **Python** | 3.10+ | `python3 --version` |
| **Node.js** | 18+ | `node --version` |
| **Git** | Any | `git --version` |

Also needed:
- **Exegol** container ([Install guide](https://docs.exegol.com/first-install/))
- **An AI client** that supports MCP — Claude Code or Kimi CLI recommended (see Step 5)

---

## Platform Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vasco0x4/AIDA.git
cd AIDA
```

### Step 2: Start the Platform

The easiest way - Docker Compose handles everything:

```bash
./start.sh
```

This starts:
- **PostgreSQL** on port `5432` - The database
- **Backend API** on port `8000` - FastAPI server
- **Frontend** on port `5173` - React dashboard

### Step 3: Verify It Works

Open your browser to [http://localhost:5173](http://localhost:5173)

You should see the AIDA dashboard.

---

## Step 4: Install and Setup Exegol

**Install Exegol:** Follow the official guide → https://docs.exegol.com/first-install

**Start the container:**
```bash
exegol start aida
```

When it asks which image to use, select ```web``` or the ```full``` one

Yeah, I know 40GB is a lot. I'm working on a lighter alternative.

**Configure AIDA:**

1. Go to http://localhost:5173/settings 
2. Under **Tools**, check if your Exegol container is detected
3. Set your default container name to `exegol-aida` (or whatever you named it)

---

## Step 5: Connect Your AI Client

Now you need to hook up AIDA to your AI assistant via MCP.

### Which AI Client Should I Use?

| AI Client | Recommendation | Setup Method |
|-----------|----------------|--------------|
| **Claude Code** | Recommended | Use `aida.py` CLI (automatic) |
| **Kimi CLI** | Recommended | Use `aida.py` CLI (automatic) |
| **Vertex AI / External API** | Recommended | Use `aida.py` with flags |
| **Antigravity** | Works | Manual MCP import |
| **Gemini CLI** | Works | Manual MCP import |
| **Claude Desktop** | Works | Manual MCP import |

---

## AIDA CLI — Claude Code & Kimi

The `aida.py` CLI is the recommended way to launch AIDA. It **auto-detects** which AI client you have installed (Claude Code or Kimi CLI) and configures everything automatically — MCP server, workspace, preprompt.

### Common Options

| Flag | Description |
|------|-------------|
| `-a`, `--assessment NAME` | Load a specific assessment directly |
| `--cli claude\|kimi\|auto` | Force a specific CLI (default: auto-detect) |
| `-m`, `--model MODEL` | Override the model used |
| `--preprompt FILE` | Use a custom preprompt file |
| `-y`, `--yes` | Auto-approve all AI actions |
| `--no-mcp` | Disable MCP server (for testing) |
| `--debug` | Enable debug output |
| `-q`, `--quiet` | Minimal startup output |
| `PROMPT...` | Pass an initial prompt directly |

---

## Claude Code

**Claude Code is recommended** because the AIDA CLI does everything for you.

### Prerequisites

You MUST have Claude Code installed and logged in:

```bash
# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash
```

### Launch AIDA

```bash
# Interactive — select assessment from list
python3 aida.py

# Direct launch with assessment name
python3 aida.py --assessment "MyTarget"

# With custom model
python3 aida.py --assessment "MyTarget" --model claude-opus-4-6

# Force Claude if both CLIs are installed
python3 aida.py --assessment "MyTarget" --cli claude

# Auto-approve all actions (no confirmation prompts)
python3 aida.py --assessment "MyTarget" --yes
```

The CLI automatically:
- Generates MCP config
- Sets working directory to assessment workspace
- Injects the pentesting methodology preprompt
- Configures all tools

You can verify if the MCP server is correctly loaded using `/mcp`

<img src="../assets/doc/mcp.png" alt="MCP Server" width="33%" />

**That's it. You're ready.**

---

## Kimi CLI

**Kimi CLI** is fully supported as an alternative to Claude Code. The AIDA CLI handles the full setup automatically.

### Prerequisites

Install Kimi CLI:

```bash
pip install kimi-cli
# or
uv tool install kimi-cli
```

Then log in and configure Kimi CLI according to its documentation.

### Launch AIDA with Kimi

```bash
# Auto-detect (picks Kimi if Claude isn't installed)
python3 aida.py --assessment "MyTarget"

# Force Kimi explicitly
python3 aida.py --assessment "MyTarget" --cli kimi

# With a specific model
python3 aida.py --assessment "MyTarget" --cli kimi --model kimi-k2

# Yolo mode — auto-approve everything
python3 aida.py --assessment "MyTarget" --cli kimi --yes
```

The CLI automatically:
- Generates a Kimi agent YAML file (`.aida/kimi-agent.yaml`)
- Injects the AIDA system prompt with assessment context
- Configures the MCP server for Kimi
- Sets the working directory to the assessment workspace

> **Note:** `--yes` maps to `--yolo` in Kimi CLI, which auto-approves all tool calls. Use with caution.

---

## Vertex AI / External API

If you're using Vertex AI or another external API (Claude only):

```bash
python3 aida.py --assessment "MyTarget" \
  --base-url "https://YOUR-VERTEX-ENDPOINT" \
  --api-key "YOUR-API-KEY" \
  --model claude-sonnet-4-5-20250929
```

Same benefits as Claude Code, but routing through your own API endpoint.

---

## Other AI Clients (Manual MCP Import)

For Antigravity, Gemini CLI, Claude Desktop, or ChatGPT, you need to manually configure the MCP server.

**The process:**

1. Import the MCP server config (see examples below)
2. Copy the preprompt from `Docs/PrePrompt.txt`
3. Paste it into your AI client when starting an assessment

> Antigravity works great if you select Claude. Gemini is OK. Any MCP-compatible client should work.
>
> **Prefer Claude Code or Kimi?** Use `aida.py` instead — it handles all of this automatically.

### Config Paths

**Antigravity:** MCP settings (UI)

**Gemini CLI:** `~/.gemini/settings.json`

**Claude Desktop:**
* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
* **Linux:** `~/.config/Claude/claude_desktop_config.json`

**ChatGPT Desktop:**
* **macOS:** `~/Library/Application Support/ChatGPT/mcp_config.json`

### MCP Configuration

Add this to your config file (replace `/absolute/path/to/AIDA/` with your actual path):

```json
{
  "mcpServers": {
    "aida-mcp": {
      "command": "/bin/bash",
      "args": [
        "/absolute/path/to/AIDA/start_mcp.sh"
      ]
    }
  }
}
```

⚠️ **Important:** Replace `/absolute/path/to/AIDA/` with your actual AIDA directory path.

**After MCP setup:**
- Restart your AI client
- Copy the preprompt from `Docs/PrePrompt.txt` and paste it into your AI client
- Say to the AI: `Load assessment "your-assessment-name" and start it`

---

## Verify Installation

Run through this checklist:

| Check | How | Expected |
|-------|-----|----------|
| Platform running | http://localhost:5173 | Dashboard loads |
| API healthy |http://localhost:8000/health | `{"status": "healthy"}` |
| Database connected | Check backend logs | No connection errors |
| Exegol container | `docker ps \| grep exegol` | Container running |
| MCP server | Check AI client | AIDA tools visible |


## Troubleshooting

TODO

---

## Next Steps

- [**User Guide**](USER_GUIDE.md) - Learn how to use the platform
- [**MCP Tools Reference**](MCP_TOOLS.md) - All available tools for your AI
- [**Architecture**](ARCHITECTURE.md) - Technical deep dive

---

## CLI Quick Reference

```bash
# List available assessments and pick one interactively
python3 aida.py

# Load a specific assessment (auto-detect CLI)
python3 aida.py -a "MyTarget"

# Force Claude Code
python3 aida.py -a "MyTarget" --cli claude

# Force Kimi CLI
python3 aida.py -a "MyTarget" --cli kimi

# Auto-approve all actions
python3 aida.py -a "MyTarget" --yes

# Custom preprompt
python3 aida.py -a "MyTarget" --preprompt /path/to/custom-preprompt.txt

# External API (Claude only)
python3 aida.py -a "MyTarget" --base-url "https://..." --api-key "..." --model claude-sonnet-4-5-20250929

# Pass an initial prompt
python3 aida.py -a "MyTarget" "Start from phase 1 and run reconnaissance"
```

---

## Need Help?

Need help? Contact **vasco0x4** on Discord.

- **GitHub Issues**: [Report bugs](https://github.com/Vasco0x4/AIDA/issues)
- **Email**: Vasco0x4@proton.me
