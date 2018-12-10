
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Base64Decode extends OperationBase { 
    protected source: string;
    protected target: string;
    private removeSource: boolean;

    constructor(config: OperationConfig) {
        super();
        this.source = '';
        this.target = '';
        this.removeSource = config.remove_source || false;
        this.validate(config);
    }

    validate(config: OperationConfig) {
        const { target_field: tField, source_field: sField, remove_source } = config;
        if (remove_source && typeof remove_source !== 'boolean') throw new Error('remove_source if specified must be of type boolean')
        if (!tField || typeof tField !== 'string' || tField.length === 0) throw new Error(`could not find target_field for ${this.constructor.name} validation or it is improperly formatted, config: ${JSON.stringify(config)}`);
        if (!sField || typeof sField !== 'string' || sField.length === 0) throw new Error(`could not find source_field for ${this.constructor.name} validation or it is improperly formatted, config: ${JSON.stringify(config)}`);
        const source = this.parseField(sField);
        const target = this.parseField(tField);
        this.source = source;
        this.target = target;
    }
    
    run(doc: DataEntity | null): DataEntity | null {
        if (!doc) return doc;

        try {
            const data = doc[this.source];
            if (typeof data !== 'string') {
                _.unset(doc, this.source);
            } else {
                const buff = Buffer.from(doc[this.source], 'base64');
                doc[this.target] = buff.toString('utf8');
            }
        } catch(err) {
            console.log('am i catching', this.source, 'and', doc)
            _.unset(doc, this.source);
        }
        if (this.removeSource) _.unset(doc, this.source);
        return doc;
    }
}