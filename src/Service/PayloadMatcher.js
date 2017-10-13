
/**
 * Allows to validate the input payload basing on definition
 */
class PayloadMatcher {
    /**
     * @param {ConfigurationLoader} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @param {string} input Incoming payload to verify
     */
    match(input) {
        for (let num in this.config.config) {
            let definition = this.config.config[num].definition;

            for (let routeNum in definition.payloads) {
                if (!definition.payloads.hasOwnProperty(routeNum)) {
                    continue;
                }

                let payload = definition.payloads[routeNum]['payload'][0]._;
                let meta = definition.payloads[routeNum]['payload'][0].$;
                let match = this._match_json(input, payload, meta);

                if (match) {
                    return;
                }
            }
        }
    }

    _match_json(input, definitionPayload, definitionMeta) {
        if (definitionMeta.type !== 'json') {
            return false;
        }

        this._iterate_json(
            JSON.parse(definitionPayload),
            JSON.parse(input),
            '/'
        );
    }

    _iterate_json(definition, request, payloadPath) {

        for (let key in definition) {
            let definitionValue = definition[key];
            let requestValue = request[key];

            let _backupPath = payloadPath;
            payloadPath = payloadPath + '/' + key;

            if (requestValue === undefined) {
                throw new DefinitionException('Missing key "' + key + '"');
            }

            if (typeof definitionValue === 'object') {
                payloadPath = this._iterate_json(definitionValue, requestValue, payloadPath);
                continue;
            }

            if (definitionValue.toString().substring(0, 5) === '_@mpp') {
                this.assertValueCorrect(definitionValue, requestValue, payloadPath);
                payloadPath = _backupPath;
            }
        }

        return payloadPath;
    }

    assertValueCorrect(rule, value, payloadPath) {
        if (!this['_rule_matcher_' + PayloadMatcher.extractMethodName(rule)](value, PayloadMatcher.extractArguments(rule))) {
            throw new DefinitionException('Payload denied at path "' + payloadPath + '"');
        }
    }

    static extractMethodName(value) {
        return value.substring(2, value.indexOf('('));
    }

    static extractArguments(value) {
        return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
    }

    _rule_matcher_mpp_match(value, definition) {
        if (definition === '*') {
            return true;
        }

        return new RegExp(definition).exec(value) !== null;
    }
}

module.exports = PayloadMatcher;
