import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { ApiResponse } from 'src/app/types';

export interface FieldSchemaProperty {
    type: Type<Model> | String;
    items?: { type: Type<Model> | String };
}

export interface FieldSchema {
    [fieldName: string]: FieldSchemaProperty;
}

export interface ModelSchema {
    /**
     * Url to add method
     */
    addProxy?: string;
    /**
     * Url to get info method
     */
    infoProxy?: string;
    /**
     * Url to update method
     */
    updateProxy?: string;
    /**
     * Url to delete method
     */
    deleteProxy?: string;
    /**
     * Root property with info
     */
    rootProperty?: string;
    /**
     * Property which identify id
     */
    idProperty?: string;
    /**
     * Field schema
     */
    fields: FieldSchema;
}

export abstract class DataObject {}

export abstract class Model extends DataObject {
    schema?: ModelSchema;
    private __schema: ModelSchema;

    constructor(data?: any) {
        super();
        Object.defineProperty(this, 'schema', {
            set: (value: ModelSchema) => {
                console.log(this);
                console.log(value);
                this.__schema = value;
                if (data && value) {
                    const fields: FieldSchema = value.fields;
                    Object.keys(fields).forEach((fieldName) => {
                        if (data[fieldName]) {
                            this[fieldName] = this.convertField(data[fieldName], fields[fieldName]);
                        }
                    });
                }
            },
            get(): ModelSchema {
                return this.__schema;
            }
        });
    }

    private convertField(data: any, field: FieldSchemaProperty) {
        if (typeof field.type !== 'string') {
            const model: Type<any> = field.type as Type<any>;
            return new model(data);
        } else {
            switch (field.type) {
                case 'date':
                    return new Date(data);
                case 'array':
                    return data.map((dataItem) => this.convertField(dataItem, field.items));
                default:
                    return data;
            }
        }
    }

    add(): Observable<ApiResponse> {
        console.log(this);
        return AppService.instance().apiRequest({ url: this.schema.addProxy, body: this.serialize() });
    }

    update(): Observable<ApiResponse> {
        return AppService.instance()
            .apiRequest({ url: this.schema.updateProxy, body: this.serialize() })
            .pipe(
                tap((response) => {
                    if (response.isSuccess) {
                        this[this.schema.idProperty] = response.data[this.schema.idProperty];
                    }
                })
            );
    }

    delete(): Observable<ApiResponse> {
        return AppService.instance()
            .apiRequest({
                url: this.schema.deleteProxy,
                body: { [this.schema.idProperty]: this[this.schema.idProperty] }
            })
            .pipe(
                tap((response) => {
                    if (response.isSuccess) {
                        this[this.schema.idProperty] = null;
                    }
                })
            );
    }

    serialize(): any {
        const data: any = {};
        Object.keys(this.schema.fields)
            .filter((field) => ![undefined].includes(this[field]))
            .forEach((field) => Object.assign(data, { [field]: this[field] }));
        return data;
    }
}
