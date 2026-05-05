import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

import SwaggerUIClient from './SwaggerUIClient';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const metadata = {
  title: 'Swagger UI',
};

export default function SwaggerPage() {
  const schemaPath = path.join(__dirname, 'api-schema.yaml');
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
