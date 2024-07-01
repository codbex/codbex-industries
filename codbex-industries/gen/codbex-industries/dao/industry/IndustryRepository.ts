import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface IndustryEntity {
    readonly Id: number;
    Name?: string;
}

export interface IndustryCreateEntity {
    readonly Name?: string;
}

export interface IndustryUpdateEntity extends IndustryCreateEntity {
    readonly Id: number;
}

export interface IndustryEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof IndustryEntity)[],
    $sort?: string | (keyof IndustryEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface IndustryEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<IndustryEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface IndustryUpdateEntityEvent extends IndustryEntityEvent {
    readonly previousEntity: IndustryEntity;
}

export class IndustryRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_INDUSTRY",
        properties: [
            {
                name: "Id",
                column: "INDUSTRY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "INDUSTRY_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(IndustryRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: IndustryEntityOptions): IndustryEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): IndustryEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: IndustryCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_INDUSTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "INDUSTRY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: IndustryUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_INDUSTRY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "INDUSTRY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: IndustryCreateEntity | IndustryUpdateEntity): number {
        const id = (entity as IndustryUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as IndustryUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_INDUSTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "INDUSTRY_ID",
                value: id
            }
        });
    }

    public count(options?: IndustryEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM ￯﾿ﾢ￯ﾾﾀ￯ﾾﾜCODBEX__tableName￯﾿ﾢ￯ﾾﾀ￯ﾾﾝ');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: IndustryEntityEvent | IndustryUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-industries-industry-Industry", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-industries-industry-Industry").send(JSON.stringify(data));
    }
}
