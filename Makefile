
format_code:
	yarn format

lint:
	yarn lint

db_auto_create_migration:
	yarn typeorm:cli -- --dataSource="./src/common/config/typeorm.config.ts" migration:generate "./src/migrations/$(name)"

db_create_migration:
	yarn typeorm:cli migration:create "./src/migrations/$(name)"

db_migrate:
	yarn typeorm:cli migration:run -- -d "./src/common/config/typeorm.config.ts"

db_revert:
	yarn typeorm:cli migration:revert -- -d "./src/common/config/typeorm.config.ts"
