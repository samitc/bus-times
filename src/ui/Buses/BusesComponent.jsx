import React from 'react';
import SelectComponent from '../Select/SelectComponent'
import { isMobile } from '../../utils/env'
export default function StationsComponent({ buses, ...props }) {
    return <SelectComponent
        items={buses}
        maxShownItems={isMobile() ? 4 : 7}
        placeholder='בחר קו'
        emptyFilterValue='אין קוים'
        {...props}
    />
}