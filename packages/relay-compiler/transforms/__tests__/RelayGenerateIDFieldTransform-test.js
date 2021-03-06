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

const GraphQLCompilerContext = require('../../core/GraphQLCompilerContext');
const GraphQLIRPrinter = require('../../core/GraphQLIRPrinter');
const RelayGenerateIDFieldTransform = require('../RelayGenerateIDFieldTransform');
const RelayParser = require('../../core/RelayParser');
const Schema = require('../../core/Schema');

const {
  TestSchema,
  generateTestsFromFixtures,
} = require('relay-test-utils-internal');

describe('RelayGenerateIDFieldTransform', () => {
  generateTestsFromFixtures(
    `${__dirname}/fixtures/generate-id-field-transform`,
    text => {
      const compilerSchema = Schema.DEPRECATED__create(TestSchema);
      const ast = RelayParser.parse(compilerSchema, text);
      return new GraphQLCompilerContext(compilerSchema)
        .addAll(ast)
        .applyTransforms([RelayGenerateIDFieldTransform.transform])
        .documents()
        .map(doc => GraphQLIRPrinter.print(compilerSchema, doc))
        .join('\n');
    },
  );
});
