FROM node:24-trixie-slim AS base

# Add Charm repo and install packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git bat gpg \
    && curl -fsSL https://repo.charm.sh/apt/gpg.key | gpg --dearmor -o /usr/share/keyrings/charm.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" > /etc/apt/sources.list.d/charm.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends glow \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install starship
RUN curl -fsSL https://starship.rs/install.sh | sh -s -- --yes

RUN useradd -m -s /bin/bash vscode

# Configure bat Dracula theme
RUN mkdir -p /home/vscode/.config/bat \
    && echo '--theme="Dracula"' > /home/vscode/.config/bat/config \
    && chown -R vscode:vscode /home/vscode/.config

# Configure starship prompt
RUN echo 'eval "$(starship init bash)"' >> /home/vscode/.bashrc

# Add 'run' alias to start/restart the dev server
RUN echo 'run() { pkill -f "node.*vite" 2>/dev/null; sleep 0.5; cd /workspaces/weather_demo && npm run dev & }' >> /home/vscode/.bashrc

# Install GitHub Copilot CLI
RUN npm install -g @githubnext/github-copilot-cli

USER vscode
WORKDIR /workspaces/weather_demo
