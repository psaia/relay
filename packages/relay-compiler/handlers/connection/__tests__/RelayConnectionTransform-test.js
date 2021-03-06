/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @emails oncall+relay
 */

'use strict';

const GraphQLCompilerContext = require('../../../core/GraphQLCompilerContext');
const GraphQLIRPrinter = require('../../../core/GraphQLIRPrinter');
const RelayConnectionTransform = require('../RelayConnectionTransform');
const Schema = require('../../../core/Schema');

const {transformASTSchema} = require('../../../core/ASTConvert');
const {
  TestSchema,
  generateTestsFromFixtures,
  parseGraphQLText,
} = require('relay-test-utils-internal');

describe('RelayConnectionTransform', () => {
  generateTestsFromFixtures(`${__dirname}/fixtures`, text => {
    const extendedSchema = transformASTSchema(TestSchema, [
      RelayConnectionTransform.SCHEMA_EXTENSION,
    ]);
    const {definitions} = parseGraphQLText(extendedSchema, text);
    const compilerSchema = Schema.DEPRECATED__create(
      TestSchema,
      extendedSchema,
    );
    return new GraphQLCompilerContext(compilerSchema)
      .addAll(definitions)
      .applyTransforms([RelayConnectionTransform.transform])
      .documents()
      .map(
        doc =>
          GraphQLIRPrinter.print(compilerSchema, doc) +
          '# Metadata:\n' +
          JSON.stringify(doc.metadata ?? null, null, 2),
      )
      .join('\n');
  });
});
