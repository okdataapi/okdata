# The okdata MCP server over stdio (mcp-typescript/, published as @okdata/mcp), for registries and
# hosts that run MCP servers in a container. It passes every request on to
# https://api.okdata.online/mcp; set OKDATA_API_KEY for paid calls (find, describe and account
# status work without it).
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json tsconfig.base.json ./
COPY mcp-typescript/package.json mcp-typescript/
RUN npm ci --workspace mcp-typescript --include-workspace-root=false --no-audit --no-fund
COPY mcp-typescript/ mcp-typescript/
RUN npm run build --workspace mcp-typescript

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY mcp-typescript/package.json mcp-typescript/
RUN npm ci --omit=dev --workspace mcp-typescript --include-workspace-root=false --no-audit --no-fund && npm cache clean --force
COPY --from=build /src/mcp-typescript/dist mcp-typescript/dist
USER node
ENTRYPOINT ["node", "mcp-typescript/dist/bin.js"]
