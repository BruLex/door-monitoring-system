import { InjectionToken } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";


export const INJECTION_TOKENS: InjectionToken<MatDialog> = new InjectionToken<MatDialog>('dialog-ref');
