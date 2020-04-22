import { Type } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AppService } from 'src/app/app.service';
import { ApiResponse } from 'src/app/types';

export interface FieldSchemaProperty {
    type: Type<Model> | String;
    validation?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
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

interface DefaultActionOptions {
    showLoadmask?: boolean;
    showResultNotification?: boolean;
}

const defaultActionOptions: DefaultActionOptions = { showLoadmask: true, showResultNotification: true };

export abstract class Model {
    schema?: ModelSchema;

    modelForm: FormGroup;
    private __schema: ModelSchema;

    constructor(data?: any) {
        Object.defineProperty(this, 'schema', {
            set: (value: ModelSchema): void => {
                this.__schema = value;
                if (value) {
                    const fields: FieldSchema = value.fields;
                    const controls: { [key: string]: AbstractControl } = {};
                    Object.keys(fields).forEach((fieldName: string): void => {
                        if (data && data[fieldName]) {
                            this[fieldName] = this.convertField(data[fieldName], fields[fieldName]);
                        }
                        controls[fieldName] = new FormControl(this[fieldName], value.fields[fieldName].validation);
                    });
                    this.modelForm = new FormGroup(controls);
                }
            },
            get(): ModelSchema {
                return this.__schema;
            }
        });
    }

    add(options: DefaultActionOptions = defaultActionOptions): Observable<ApiResponse> {
        const { showLoadmask, showResultNotification }: DefaultActionOptions = options;
        if (showLoadmask) {
            AppService.instance().showLoadmask();
        }
        return AppService.instance()
            .apiRequest({ url: this.schema.addProxy, body: this.serialize() })
            .pipe(
                tap((response: ApiResponse): void => {
                    const { idProperty }: ModelSchema = this.schema;
                    const { data, message }: ApiResponse = response;
                    if (response.isSuccess) {
                        this[idProperty] = data[idProperty];
                    }
                    if (showResultNotification) {
                        AppService.instance().openSnackBar(
                            response.isSuccess
                                ? `Entity added successfully, new ${idProperty}: ${data[idProperty]}`
                                : message || 'Internal error'
                        );
                    }
                }),
                finalize((): void => {
                    if (showLoadmask) {
                        AppService.instance().hideLoadmask();
                    }
                })
            );
    }

    update(options: DefaultActionOptions = defaultActionOptions): Observable<ApiResponse> {
        const { showLoadmask, showResultNotification }: DefaultActionOptions = options;

        if (showLoadmask) {
            AppService.instance().showLoadmask();
        }
        return AppService.instance()
            .apiRequest({ url: this.schema.updateProxy, body: this.serialize() })
            .pipe(
                tap((response: ApiResponse): void => {
                    const { idProperty }: ModelSchema = this.schema;
                    if (showResultNotification) {
                        AppService.instance().openSnackBar(
                            response.isSuccess
                                ? `Entity with ${idProperty}: ${this[idProperty]} updated successfully`
                                : response?.message || 'Internal error'
                        );
                    }
                }),
                finalize((): void => {
                    if (showLoadmask) {
                        AppService.instance().hideLoadmask();
                    }
                })
            );
    }

    delete(options: DefaultActionOptions = defaultActionOptions): Observable<ApiResponse> {
        const { showLoadmask, showResultNotification }: DefaultActionOptions = options;

        const { idProperty }: ModelSchema = this.schema;
        if (showLoadmask) {
            AppService.instance().showLoadmask();
        }
        return AppService.instance()
            .apiRequest({
                url: this.schema.deleteProxy,
                body: { [idProperty]: this[idProperty] }
            })
            .pipe(
                tap((response: ApiResponse): void => {
                    if (showResultNotification) {
                        AppService.instance().openSnackBar(
                            response.isSuccess
                                ? `Entity with ${idProperty}: ${this[idProperty]} deleted successfully`
                                : response?.message || 'Internal error'
                        );
                    }
                    if (response.isSuccess) {
                        this[idProperty] = null;
                    }
                }),
                finalize((): void => {
                    if (showLoadmask) {
                        AppService.instance().hideLoadmask();
                    }
                })
            );
    }

    serialize(): any {
        const data: any = {};
        Object.keys(this.schema.fields)
            .filter((field: string): boolean => ![undefined].includes(this[field]))
            .forEach((field: string): any => {
                Object.assign(data, { [field]: this.serializeField(this[field], this.schema.fields[field]) });
            });
        return data;
    }

    private serializeField(data: any, field: FieldSchemaProperty): any {
        if (typeof field.type !== 'string') {
            const model: Type<any> = field.type as Type<any>;
            return (data as Model).serialize();
        } else {
            switch (field.type) {
                case 'date':
                    return new Date(data).toString();
                case 'array':
                    return data.map((dataItem): any => this.serializeField(dataItem, field.items));
                default:
                    return data;
            }
        }
    }

    private convertField(data: any, field: FieldSchemaProperty): any {
        if (typeof field.type !== 'string') {
            const model: Type<any> = field.type as Type<any>;
            return new model(data);
        } else {
            switch (field.type) {
                case 'date':
                    return new Date(data);
                case 'array':
                    return data.map((dataItem): any => this.convertField(dataItem, field.items));
                default:
                    return data;
            }
        }
    }
}
