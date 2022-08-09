
import { convertToParamMap } from '@angular/router';

export const activatedRouteSpy: any = {
  snapshot: {
    paramMap: convertToParamMap({
      key: 'API-KEY',
      colors: '_ff0000,_ffff00,_0000ff'
    })
  }
};
