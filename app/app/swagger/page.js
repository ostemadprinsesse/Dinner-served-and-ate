import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

import SwaggerUIClient from './SwaggerUIClient';

export const metadata = {
  title: 'Swagger UI',
};

export default function SwaggerPage() {
  const schemaPath = path.join(process.cwd(), 'api-schema.yaml');
  const schemaYaml = fs.readFileSync(schemaPath, 'utf8');
  const spec = yaml.load(schemaYaml);

  return (
    <main>
      <h1>Swagger UI</h1>
      <p>
        OpenAPI spec loaded from <code>api-schema.yaml</code>
      </p>
      <SwaggerUIClient spec={spec} />
    </main>
  );
}
