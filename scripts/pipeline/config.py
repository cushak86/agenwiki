from pathlib import Path
import os


SCRIPT_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = SCRIPT_ROOT.parent

QUEUE_DIR = SCRIPT_ROOT / "queue"
STAGING_DIR = SCRIPT_ROOT / "staging"
STATE_DIR = SCRIPT_ROOT / "state"
SEEN_PATH = STATE_DIR / "seen.json"

MULTIAGENT_ROOT = Path(os.environ.get("MULTIAGENT_ROOT", r"C:\agents\multi-agent"))
DISCORD_ADAPTER = MULTIAGENT_ROOT / "_shared" / "adapters" / "notify_discord.sh"

GIT_AUTHOR_EMAIL = "suhun.lee59@gmail.com"
GIT_AUTHOR_NAME = "cushak86"
USER_AGENT = "agenwiki-content-pipeline/0.1 (mailto:suhun.lee59@gmail.com)"


def ensure_pipeline_dirs():
    QUEUE_DIR.mkdir(parents=True, exist_ok=True)
    STAGING_DIR.mkdir(parents=True, exist_ok=True)
    STATE_DIR.mkdir(parents=True, exist_ok=True)
