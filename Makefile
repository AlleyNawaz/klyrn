.PHONY: demo dev setup clean

# Boot everything and seed in one command
demo: setup
	@echo "🚀 Starting all services..."
	docker compose -f infra/docker-compose.yml up -d
	@echo "⏳ Waiting for Postgres & Redis..."
	sleep 3
	pnpm db:push
	pnpm seed:demo
	@echo "✅ Demo ready! Run 'pnpm dev' to start all services."
	pnpm dev

# First-time setup
setup:
	pnpm install
	cp -n .env.example .env || true

# Start dev servers
dev:
	docker compose -f infra/docker-compose.yml up -d
	pnpm dev

# Clean everything
clean:
	docker compose -f infra/docker-compose.yml down -v
	pnpm clean
