import SwaggerUIClient from './SwaggerUIClient';

export const metadata = {
  title: 'Swagger UI',
};

async function getSwaggerSpec() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/api/swagger-schema`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch swagger schema');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading swagger spec:', error);
    return {};
  }
}

export default async function SwaggerPage() {
  const spec = await getSwaggerSpec();

  return (
    <main>
      <h1>Swagger UI</h1>
      <p>
        OpenAPI spec loaded from backend API
      </p>
      <SwaggerUIClient spec={spec} />
    </main>
  );
}
