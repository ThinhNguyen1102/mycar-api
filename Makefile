log_server:
	docker logs -n 100 --follow ugc-server

format_code:
	yarn format

lint:
	yarn lint

db_auto_create_migration:
	docker exec mycar-api yarn typeorm:cli -- --dataSource="./src/common/config/typeOrm.config.ts" migration:generate "./src/migrations/$(name)"

db_create_migration:
	docker exec mycar-api yarn typeorm:cli migration:create "./src/migrations/$(name)"

db_migrate:
	docker exec mycar-api yarn typeorm:cli migration:run -- -d "./src/common/config/typeOrm.config.ts"

db_revert:
	docker exec mycar-api yarn typeorm:cli migration:revert -- -d "./src/common/config/typeOrm.config.ts"
