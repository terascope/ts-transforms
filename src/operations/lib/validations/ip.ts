
import { DataEntity } from '@terascope/job-components';
import _ from 'lodash';
import net from 'net';
import OperationBase from '../base';
import { OperationConfig } from '../../../interfaces';

export default class Ip extends OperationBase {
    constructor(config: OperationConfig) {
        super(config);
    }

    run(doc: DataEntity): DataEntity | null {
        const field = _.get(doc, this.source);
        if (net.isIP(field) === 0) _.unset(doc, this.source);
        return doc;
    }
}
