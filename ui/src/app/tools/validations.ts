import { FormControl, Validators } from "@angular/forms";


interface ValidationConfig {
    default?: any;
    type: 'ip' | 'str';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}

export function createFormControl(config: ValidationConfig): FormControl {
    switch (config.type) {
        case 'ip':
            return new FormControl('',
                [
                    Validators.maxLength(15),
                    Validators.pattern(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/),
                    ...(config.required ? [Validators.required] : [])
                ]
            );
        case "str":
            return new FormControl('',
                [
                    Validators.minLength(config.minLength || 0),
                    Validators.maxLength(config.maxLength || 255),
                    ...(config.required ? [Validators.required] : [])
                ]
            );
        default:
            return null;
    }
}
