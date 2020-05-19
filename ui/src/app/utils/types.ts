export interface RootComponentInterface {
    showLoadmask(): void;

    hideLoadmask(): void;
}

export enum Statuses {
    Success = 'success',
    Error = 'error'
}

export class ApiResponse {
    /**
     * Status of API responce
     */
    status: Statuses;
    /**
     * Raw API data
     */
    data?: any;
    /**
     * Error message if status will be error
     */
    message?: string;

    get isSuccess(): boolean {
        return this.status === Statuses.Success;
    }

    constructor(data: object = {}) {
        Object.keys(data).forEach((key: string): any => (this[key] = data[key]));
    }
}

export interface ConfirmDialogConfig {
    message: string;
    onSuccess: () => void;
    onFail?: () => void;
}
